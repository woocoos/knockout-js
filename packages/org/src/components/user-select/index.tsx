import { Input, ModalProps } from 'antd';
import { useEffect, useState } from 'react';
import { SearchProps } from "antd/lib/input";
import UserModal from '../user-modal';
import { OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables, User, UserUserType, gid } from '@knockout-js/api';
import { CloseCircleFilled } from '@ant-design/icons';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-table';
import { gql, query } from '@knockout-js/ice-urql/request';
import { iceUrqlInstance } from '..';

export interface UserSelectLocale {
  placeholder: string;
  title: string;
}

export interface UserSelectProps {
  /**
   * 值
   */
  value?: User | User['id'];
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * orgId的用户
   */
  orgId?: string;
  /**
   * orgRoleId的用户
   */
  orgRoleId?: string;
  /**
   * 过滤用户类型
   */
  userType?: UserUserType;
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
  proTableProps?: ProTableProps<User, Record<string, any>, 'text'>;
  /**
* 有缓存列表可以快速提供初始化值配合value传入的是id处理
*/
  dataSource?: User[];
  /**
   * changeValue=id: onChange的第一个参数值就为id的值
   */
  changeValue?: keyof User;
  /**
   * 值变更事件 (value?: User[keyof User] | User, original?: User) => void;
   */
  onChange?: (value?: User[keyof User] | User, original?: User) => void;
}

const userInfoQuery = gql(/* GraphQL */`query orgPkgUserInfo($gid: GID!){
  node(id:$gid){
    ... on User{
      id,displayName,email,mobile
    }
  }
}`);

const OrgSelect = (props: UserSelectProps) => {
  const locale = useLocale('UserSelect'),
    [info, setInfo] = useState<User>(),
    [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof props.value === 'string') {
      if (props.dataSource) {
        setInfo(props.dataSource.find(item => item.id === props.value));
      } else {
        query<OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables>(userInfoQuery, {
          gid: gid('user', props.value),
        }, { instanceName: iceUrqlInstance.ucenter }).then(result => {
          if (result.data?.node?.__typename === 'User') {
            setInfo(result.data.node as User);
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
        value={info?.displayName}
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
      <UserModal
        open={open}
        orgId={props.orgId}
        orgRoleId={props.orgRoleId}
        userType={props.userType}
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
