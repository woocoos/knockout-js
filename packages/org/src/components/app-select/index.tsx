import { AutoComplete, Button, Input, InputProps, ModalProps, Space } from 'antd';
import ModalApp from '../app-modal';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { App, AppOrder, AppListQuery, AppListQueryVariables, AppWhereInput, OrgAppListQuery, OrgAppListQueryVariables, OrgPkgAppInfoQuery, OrgPkgAppInfoQueryVariables } from '@knockout-js/api/ucenter';
import { gid, instanceName } from '@knockout-js/api';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-components';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import { BaseOptionType } from 'antd/es/select';
import styles from '../assets/autoComplete.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';

export interface AppSelectLocale {
  placeholder: string;
  title: string;
}

export interface AppSelectProps {
  /**
   * 值
   */
  value?: App | App["id"];
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 只读
   */
  readonly?: boolean;
  /**
   * orgId授权的应用
   */
  orgId?: string;
  /**
   * 查询条件
   */
  where?: AppWhereInput;
  /**
   * 排序
   */
  orderBy?: AppOrder;
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
  proTableProps?: ProTableProps<App, Record<string, any>, 'text'>;
  /**
   * 禁用时替换search的显示位置
   */
  suffix?: ReactNode;
  /**
   * 有缓存列表可以快速提供初始化值配合value传入的是id处理
   */
  dataSource?: App[];
  /**
   * changeValue=id: onChange的第一个参数值就为id的值
   */
  changeValue?: keyof App;
  /**
   * 值变更事件 (value?:App[keyof App] | App,original?:App) => void;
   */
  onChange?: (value?: App[keyof App] | App, original?: App) => void;
  /**
   * onChange被占用时使用
   */
  onOriginalChange?: (value?: App) => void;
}

const appInfoQuery = gql(/* GraphQL */`query orgPkgAppInfo($gid: GID!){
  node(id:$gid){
    ... on App{
      id,name,code,kind,comments,status
    }
  }
}`);

const orgAppListQuery = gql(/* GraphQL */`query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  node(id:$gid){
    ... on Org{
      id
      apps(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,name,code,kind,comments,status
          }
        }
      }
    }
  }
}`);

const appListQuery = gql(/* GraphQL */`query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  apps(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,code,kind,comments,status
      }
    }
  }
}`);


export default (props: AppSelectProps) => {
  const locale = useLocale('AppSelect'),
    autoCompleteRef = useRef<any>(null),
    requestIdRef = useRef(0),
    blurredDuringLoadingRef = useRef(false),
    [info, setInfo] = useState<App>(),
    [loading, setLoading] = useState(false),
    [keyword, setKeyword] = useState<string>(),
    [options, setOptions] = useState<BaseOptionType[]>([]),
    [open, setOpen] = useState(false);

  const setValue = useCallback((original?: App) => {
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
    const os: BaseOptionType[] = [];
    const where: AppWhereInput = {
      ...props.where,
    }
    if (keywordStr) {
      where.or = [
        { nameContains: keywordStr },
        { codeContains: keywordStr },
      ]
    }
    if (props.orgId) {
      const result = await paging<OrgAppListQuery, OrgAppListQueryVariables>(orgAppListQuery, {
        gid: gid('Org', props.orgId),
        first: 20,
        orderBy: props.orderBy,
        where,
      }, 1, { instanceName: instanceName.UCENTER });
      if (result.data?.node?.__typename === 'Org') {
        result.data.node.apps.edges?.forEach(item => {
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
      const result = await paging<AppListQuery, AppListQueryVariables>(appListQuery, {
        first: 20,
        orderBy: props.orderBy,
        where,
      }, 1, { instanceName: instanceName.UCENTER });
      if (result.data?.apps.totalCount) {
        result.data.apps.edges?.forEach(item => {
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
        query<OrgPkgAppInfoQuery, OrgPkgAppInfoQueryVariables>(appInfoQuery, {
          gid: gid('App', props.value),
        }, { instanceName: instanceName.UCENTER }).then(result => {
          if (result.data?.node?.__typename === 'App') {
            setInfo(result.data.node as App);
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
      <ModalApp
        open={open}
        title={locale.title}
        modalProps={props.modalProps}
        where={props.where}
        orderBy={props.orderBy}
        proTableProps={props.proTableProps}
        orgId={props.orgId}
        onClose={(selectData) => {
          if (selectData?.length) {
            setValue(selectData[0])
          }
          setOpen(false);
        }}
      />
    </>
  );
};
