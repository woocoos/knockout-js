import { AutoComplete, Input, ModalProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { SearchProps } from "antd/lib/input";
import UserModal from '../user-modal';
import { OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables, OrgRoleUserListQuery, OrgRoleUserListQueryVariables, OrgUserListQuery, OrgUserListQueryVariables, User, UserListQuery, UserListQueryVariables, UserUserType, UserWhereInput, gid } from '@knockout-js/api';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-table';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import { iceUrqlInstance } from '..';
import styles from '../assets/autoComplete.module.css';
import { BaseOptionType } from 'antd/es/select';

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


const userListQuery = gql(/* GraphQL */`query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  users(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        email,mobile,userType,creationType,registerIP,status,comments
      }
    }
  }
}`);

const orgUserListQuery = gql(/* GraphQL */`query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  node(id:$gid){
    ... on Org{
      id,
      users(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
            email,mobile,userType,creationType,registerIP,status,comments
          }
        }
      }
    }
  }
}`);

const orgRoleUserListQuery = gql(/* GraphQL */`query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        email,mobile,userType,creationType,registerIP,status,comments
      }
    }
  }
}`);

let searchTimeoutFn: NodeJS.Timeout | undefined = undefined;

const OrgSelect = (props: UserSelectProps) => {
  const locale = useLocale('UserSelect'),
    [info, setInfo] = useState<User>(),
    [keyword, setKeyword] = useState<string>(),
    [options, setOptions] = useState<BaseOptionType[]>([]),
    [open, setOpen] = useState(false);

  const setValue = useCallback((original?: User) => {
    if (original) {
      const value = props.changeValue ? original[props.changeValue] : original;
      setInfo(original);
      setKeyword(original.displayName);
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
        setKeyword(data?.displayName);
      } else {
        query<OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables>(userInfoQuery, {
          gid: gid('user', props.value),
        }, { instanceName: iceUrqlInstance.ucenter }).then(result => {
          if (result.data?.node?.__typename === 'User') {
            setInfo(result.data.node as User);
            setKeyword(result.data.node.displayName);
          }
        })
      }
    } else {
      setInfo(props.value)
      setKeyword(props.value?.displayName);
    }
  }, [props.value, props.dataSource])

  return (
    <>
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
          setKeyword(info?.displayName);
        }}
        onSelect={(v, option) => {
          setValue(option.info);
        }}
        onSearch={async (keywordStr) => {
          setKeyword(keywordStr);
          clearTimeout(searchTimeoutFn);
          searchTimeoutFn = setTimeout(async () => {
            const os: BaseOptionType[] = [],
              first = 15,
              where: UserWhereInput = {
                displayNameContains: keywordStr,
              };
            if (keywordStr) {
              if (props.orgRoleId) {
                const result = await paging<OrgRoleUserListQuery, OrgRoleUserListQueryVariables>(orgRoleUserListQuery, {
                  roleId: props.orgRoleId,
                  first,
                  where,
                }, 1, { instanceName: iceUrqlInstance.ucenter });
                if (result.data?.orgRoleUsers.totalCount) {
                  result.data.orgRoleUsers.edges?.forEach(item => {
                    if (item?.node) {
                      os.push({
                        label: item.node.displayName,
                        value: item.node.id,
                        info: item.node,
                      })
                    }
                  })
                }
              } else if (props.orgId) {
                const result = await paging<OrgUserListQuery, OrgUserListQueryVariables>(orgUserListQuery, {
                  gid: gid('org', props.orgId),
                  first,
                  where,
                }, 1, { instanceName: iceUrqlInstance.ucenter });
                if (result.data?.node?.__typename === 'Org') {
                  result.data.node.users.edges?.forEach(item => {
                    if (item?.node) {
                      os.push({
                        label: item.node.displayName,
                        value: item.node.id,
                        info: item.node,
                      })
                    }
                  })
                }
              } else {
                const result = await paging<UserListQuery, UserListQueryVariables>(userListQuery, {
                  first,
                  where,
                }, 1, { instanceName: iceUrqlInstance.ucenter });
                if (result.data?.users.totalCount) {
                  result.data.users.edges?.forEach(item => {
                    if (item?.node) {
                      os.push({
                        label: item.node.displayName,
                        value: item.node.id,
                        info: item.node,
                      })
                    }
                  })
                }
              }

            }
            setOptions(os);
          }, 500)
        }}
      >
        <Input.Search
          placeholder={locale.placeholder}
          {...props.searchProps}
          onSearch={() => {
            setOpen(true);
          }}
        />
      </AutoComplete>
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
            setValue(selectData[0])
          }
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgSelect;
