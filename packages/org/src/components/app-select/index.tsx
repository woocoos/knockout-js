import { Input, ModalProps } from 'antd';
import ModalApp from '../app-modal';
import { useEffect, useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { App, OrgPkgAppInfoQuery, OrgPkgAppInfoQueryVariables, gid } from '@knockout-js/api';
import { useLocale } from '../locale';
import { SearchProps } from 'antd/es/input';
import { ProTableProps } from '@ant-design/pro-table';
import { gql, query } from '@knockout-js/ice-urql/request';
import { iceUrqlInstance } from '..';

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
   * ant SearchProps api
   */
  searchProps?: SearchProps;
  /**
   * ant ModalProps api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<App, Record<string, any>, 'text'>;
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

export default (props: AppSelectProps) => {
  const locale = useLocale('AppSelect'),
    [info, setInfo] = useState<App>(),
    [modal, setModal] = useState<{
      open: boolean;
    }>({
      open: false,
    });

  useEffect(() => {
    if (typeof props.value === 'string') {
      if (props.dataSource) {
        setInfo(props.dataSource.find(item => item.id === props.value));
      } else {
        query<OrgPkgAppInfoQuery, OrgPkgAppInfoQueryVariables>(appInfoQuery, {
          gid: gid('app', props.value),
        }, { instanceName: iceUrqlInstance.ucenter }).then(result => {
          if (result.data?.node?.__typename === 'App') {
            setInfo(result.data.node as App);
          }
        })
      }
    } else {
      setInfo(props.value)
    }
  }, [props.value, props.dataSource])

  return (
    <>
      <Input.Search
        placeholder={locale.placeholder}
        {...props.searchProps}
        value={info?.name || ''}
        disabled={props.disabled}
        suffix={info && !props.disabled ? <CloseCircleFilled
          style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            setInfo(undefined);
            props.onChange?.();
          }}
          rev={undefined}
        /> : <span />}
        onSearch={() => {
          modal.open = true;
          setModal({ ...modal });
        }}
      />
      <ModalApp
        open={modal.open}
        title={locale.title}
        modalProps={props.modalProps}
        proTableProps={props.proTableProps}
        orgId={props.orgId}
        onClose={(selectData) => {
          if (selectData?.length) {
            const original = selectData[0],
              value = props.changeValue ? original[props.changeValue] : original;
            setInfo(original);
            props.onChange?.(value, original);
          }
          modal.open = false;
          setModal({ ...modal });
        }}
      />
    </>
  );
};
