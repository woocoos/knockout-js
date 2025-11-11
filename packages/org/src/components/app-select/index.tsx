import { AutoComplete, Button, Input, InputProps, ModalProps, Space } from 'antd';
import ModalApp from '../app-modal';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { App, AppListQuery, AppListQueryVariables, AppWhereInput, OrgAppListQuery, OrgAppListQueryVariables, OrgPkgAppInfoQuery, OrgPkgAppInfoQueryVariables } from '@knockout-js/api/ucenter';
import { gid, instanceName } from '@knockout-js/api';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-components';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import { BaseOptionType } from 'antd/es/select';
import styles from '../assets/autoComplete.module.css';
import { SearchOutlined } from '@ant-design/icons';

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
   * orgId授权的应用
   */
  orgId?: string;
  /**
   * 查询条件
   */
  where?: AppWhereInput;
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
    searchTimeoutFn = useRef<NodeJS.Timeout | undefined>(undefined),
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
    } else {
      setKeyword(undefined);
      setInfo(undefined);
      props.onChange?.();
    }
  }, [])

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
        <AutoComplete
          className={styles.autoComplete}
          value={keyword}
          options={options}
          allowClear={!props.disabled}
          disabled={props.disabled}
          onClear={() => {
            setValue();
            setOptions([]);
          }}
          onBlur={() => {
            setKeyword(info?.name);
          }}
          onSelect={(v, option) => {
            setValue(option.info);
          }}
          onSearch={async (keywordStr) => {
            setKeyword(keywordStr);
            clearTimeout(searchTimeoutFn.current);
            searchTimeoutFn.current = setTimeout(async () => {
              const os: BaseOptionType[] = [];
              if (keywordStr) {
                setLoading(true)
                if (props.orgId) {
                  const result = await paging<OrgAppListQuery, OrgAppListQueryVariables>(orgAppListQuery, {
                    gid: gid('Org', props.orgId),
                    first: 15,
                    where: {
                      ...props.where,
                      nameContains: keywordStr,
                    }
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
                    first: 15,
                    where: {
                      ...props.where,
                      nameContains: keywordStr,
                    }
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
              }
              setLoading(false)
              setOptions(os);
            }, 500)
          }}
        >
          <Input
            placeholder={locale.placeholder}
            {...props.inputProps}
          />
        </AutoComplete>
        {
          props.disabled ? props.suffix : <Button
            loading={loading}
            icon={<SearchOutlined />}
            onClick={() => {
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
