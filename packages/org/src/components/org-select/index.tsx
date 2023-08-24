import { Input, ModalProps } from 'antd';
import { useEffect, useState } from 'react';
import { SearchProps } from "antd/lib/input";
import OrgModal from '../org-modal';
import { Org, OrgKind, OrgPkgOrgInfoQuery, OrgPkgOrgInfoQueryVariables, gid } from '@knockout-js/api';
import { CloseCircleFilled } from '@ant-design/icons';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-table';
import { gql, query } from '@knockout-js/ice-urql/request';
import { iceUrqlInstance } from '..';

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
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
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
}

const orgInfoQuery = gql(/* GraphQL */`query orgPkgOrgInfo($gid: GID!){
  node(id:$gid){
    ... on Org{
      id,name,code,kind
    }
  }
}`);

const OrgSelect = (props: OrgSelectProps) => {
  const locale = useLocale('OrgSelect'),
    [info, setInfo] = useState<Org>(),
    [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof props.value === 'string') {
      if (props.dataSource) {
        setInfo(props.dataSource.find(item => item.id === props.value));
      } else {
        query<OrgPkgOrgInfoQuery, OrgPkgOrgInfoQueryVariables>(orgInfoQuery, {
          gid: gid('org', props.value),
        }, { instanceName: iceUrqlInstance.ucenter }).then(result => {
          if (result.data?.node?.__typename === 'Org') {
            setInfo(result.data.node as Org);
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
        value={info?.name}
        disabled={props.disabled}
        suffix={info && !props.disabled ? <CloseCircleFilled
          style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            setInfo(undefined);
            props.onChange?.();
          }} rev={undefined} /> : <span />}
        onSearch={() => {
          setOpen(true);
        }}
      />
      <OrgModal
        open={open}
        orgId={props.orgId}
        appId={props.appId}
        kind={props.kind}
        title={locale.title}
        modalProps={props.modalProps}
        proTableProps={props.proTableProps}
        onClose={(selectData) => {
          if (selectData?.length) {
            const original = selectData[0],
              value = props.changeValue ? original[props.changeValue] : original;
            setInfo(original);
            props.onChange?.(value, original);
          }
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgSelect;
