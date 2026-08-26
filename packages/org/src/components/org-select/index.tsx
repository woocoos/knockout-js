import { AutoComplete, Button, Input, InputProps, ModalProps, Space } from 'antd';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import OrgModal from '../org-modal';
import { AppOrgListQuery, AppOrgListQueryVariables, OrderDirection, Org, OrgKind as UcenterOrgKind, OrgListQuery, OrgListQueryVariables, OrgOrder, OrgOrderField, OrgPkgOrgInfoQuery, OrgPkgOrgInfoQueryVariables, OrgWhereInput } from '@knockout-js/api/ucenter';
import { gid, instanceName } from '@knockout-js/api';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-components';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import styles from '../assets/autoComplete.module.css';
import { BaseOptionType } from 'antd/es/select';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';

// fix publish error: Property 'kind' of exported interface has or is using private name 'OrgKind'.
enum OrgKind {
  Org = UcenterOrgKind.Org,
  Root = UcenterOrgKind.Root,
};

export interface OrgSelectLocale {
  placeholder: string;
  title: string;
}

export interface OrgSelectProps {
  /**
   * 值
   */
  value?: Org | Org['id'];
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 只读
   */
  readonly?: boolean;
  /**
   * 根据orgId过滤pathHasPrefix
   */
  orgId?: string;
  /**
   * appId授权的组织列表
   */
  appId?: string;
  /**
   * 类型
   */
  kind: OrgKind;
  /**
   * 查询条件
   */
  where?: OrgWhereInput;
  /**
   * 排序，默认按 DisplaySort 升序
   */
  orderBy?: OrgOrder;
  /**
   * ant InputProps api
   */
  inputProps?: InputProps;
  /**
   * ant ModalProps api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
  /**
   * 禁用时替换search的显示位置
   */
  suffix?: ReactNode;
  /**
  * 有缓存列表可以快速提供初始化值配合value传入的是id处理
  */
  dataSource?: Org[];
  /**
   * changeValue=id: onChange的第一个参数值就为id的值
   */
  changeValue?: keyof Org;
  /**
   * 值变更事件 (value?: Org[keyof Org] | Org, original?: Org) => void;
   */
  onChange?: (value?: Org[keyof Org] | Org, original?: Org) => void;
  /**
   * onChange被占用时使用
   */
  onOriginalChange?: (value?: Org) => void;
}

const orgInfoQuery = gql(/* GraphQL */`query orgPkgOrgInfo($gid: GID!){
  node(id:$gid){
    ... on Org{
      id,name,code,kind
    }
  }
}`);


const appOrgListQuery = gql(/* GraphQL */`query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  node(id:$gid){
    ... on App{
      id,
      orgs(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,ownerID,parentID,kind,profile,
            domain,code,name,countryCode,timezone,
            owner { id,displayName }
          }
        }
      }
    }
  }
}`);

const orgListQuery = gql(/* GraphQL */`query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  organizations(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,ownerID,parentID,kind,profile,
        domain,code,name,countryCode,timezone,
        owner { id,displayName }
      }
    }
  }
}`);


const OrgSelect = (props: OrgSelectProps) => {
  const locale = useLocale('OrgSelect'),
    autoCompleteRef = useRef<any>(null),
    requestIdRef = useRef(0),
    blurredDuringLoadingRef = useRef(false),
    [info, setInfo] = useState<Org>(),
    [loading, setLoading] = useState(false),
    [keyword, setKeyword] = useState<string>(),
    [options, setOptions] = useState<BaseOptionType[]>([]),
    [open, setOpen] = useState(false);

  const setValue = useCallback((original?: Org) => {
    if (original) {
      const value = props.changeValue ? original[props.changeValue] : original;
      setInfo(original);
      setKeyword(original.name);
      props.onChange?.(value, original);
      props.onOriginalChange?.(original);
    } else {
      setKeyword(undefined);
      setInfo(undefined);
      props.onOriginalChange?.();
    }
    setOptions([]);
  }, [])

  // 提取搜索逻辑为独立函数
  const executeSearch = async (keywordStr: string) => {
    const os: BaseOptionType[] = [],
      where = {
        ...props.where,
        nameContains: keywordStr,
      },
      orderBy = props.orderBy ?? {
        direction: OrderDirection.Asc,
        field: OrgOrderField.DisplaySort,
      };
    if (props.appId) {
      const result = await paging<AppOrgListQuery, AppOrgListQueryVariables>(appOrgListQuery, {
        gid: gid('App', props.appId), first: 20, where, orderBy,
      }, 1, { instanceName: instanceName.UCENTER });
      if (result.data?.node?.__typename === 'App') {
        result.data.node.orgs.edges?.forEach(item => {
          if (item?.node) {
            os.push({
              label: item.node.name,
              value: item.node.id,
              info: item.node,
            })
          }
        })
      }
    } else {
      const result = await paging<OrgListQuery, OrgListQueryVariables>(orgListQuery, {
        first: 20, where, orderBy,
      }, 1, { instanceName: instanceName.UCENTER });
      if (result.data?.organizations.totalCount) {
        result.data.organizations.edges?.forEach(item => {
          if (item?.node) {
            os.push({
              label: item.node.name,
              value: item.node.id,
              info: item.node,
            })
          }
        })
      }
    }
    return os;
  };

  // 防抖搜索，带竞态保护
  const debouncedSearch = useDebounceCallback(async (keywordStr: string) => {
    const currentRequest = ++requestIdRef.current;
    const optionList = await executeSearch(keywordStr);
    // 只处理最新请求的结果，忽略过期的响应
    if (currentRequest !== requestIdRef.current) {
      return;
    }

    setLoading(false);

    if (blurredDuringLoadingRef.current) {
      blurredDuringLoadingRef.current = false;
      // 多结果或无结果，keyword 保持用户输入
      return;
    }
    setOptions(optionList);
  }, 500);

  useEffect(() => {
    if (typeof props.value === 'string') {
      if (props.dataSource) {
        const data = props.dataSource.find(item => item.id === props.value)
        setInfo(data);
        setKeyword(data?.name);
      } else {
        query<OrgPkgOrgInfoQuery, OrgPkgOrgInfoQueryVariables>(orgInfoQuery, {
          gid: gid('Org', props.value),
        }, { instanceName: instanceName.UCENTER }).then(result => {
          if (result.data?.node?.__typename === 'Org') {
            setInfo(result.data.node as Org);
            setKeyword(result.data.node.name);
          }
        })
      }
    } else {
      setInfo(props.value)
      setKeyword(props.value?.name);
    }
  }, [props.value, props.dataSource])

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        {
          props.readonly ? <Input value={keyword} readOnly {...props.inputProps} /> : <AutoComplete
            ref={autoCompleteRef}
            className={styles.autoComplete}
            value={keyword}
            options={options}
            allowClear={loading ? false : !props.disabled}
            disabled={props.disabled}
            onClear={() => {
              setValue();
            }}
            onBlur={() => {
              if (!loading) {
                if (keyword) {
                  setKeyword(info?.name);
                } else {
                  setValue(undefined)
                }
              } else {
                // 加载中，先不动 keyword，等搜索完再决定
                blurredDuringLoadingRef.current = true;
              }
              setOptions([]);
            }}
            onFocus={() => {
              blurredDuringLoadingRef.current = false;
            }}
            onSelect={(v, option) => {
              setValue(option.info);
            }}
            onSearch={(keyword) => {
              setKeyword(keyword);
              const keywordStr = keyword ? keyword.trim() : '';
              if (keywordStr) {
                setLoading(true);
                debouncedSearch(keywordStr);
              } else {
                setOptions([]);
                setLoading(false);
              }
            }}
          >
            <Input
              placeholder={locale.placeholder}
              style={{ minHeight: 32 }}
              {...props.inputProps}
            />
          </AutoComplete>
        }
        {
          props.suffix ? props.suffix : (props.disabled || props.readonly) ? <></> : <Button
            loading={loading}
            icon={<SearchOutlined />}
            onClick={(e) => {
              (e.currentTarget as HTMLElement).blur();
              setOpen(true);
            }}
          />
        }
      </Space.Compact>
      <OrgModal
        open={open}
        orgId={props.orgId}
        appId={props.appId}
        kind={props.kind}
        where={props.where}
        orderBy={props.orderBy}
        title={locale.title}
        modalProps={props.modalProps}
        proTableProps={props.proTableProps}
        onClose={(selectData) => {
          if (selectData?.length) {
            setValue(selectData[0])
          }
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgSelect;
