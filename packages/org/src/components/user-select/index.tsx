import { AutoComplete, Button, Input, InputProps, ModalProps, Space } from 'antd';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import UserModal from '../user-modal';
import { OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables, OrgRoleUserListQuery, OrgRoleUserListQueryVariables, OrgUserListQuery, OrgUserListQueryVariables, User, UserListQuery, UserListQueryVariables, UserOrder, UserUserType as UcenterUserUserType, UserWhereInput, } from '@knockout-js/api/ucenter';
import { gid, instanceName } from '@knockout-js/api';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-components';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import styles from '../assets/autoComplete.module.css';
import { BaseOptionType } from 'antd/es/select';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';

// fix publish error: Property 'userType' of exported interface has or is using private name 'UserUserType'
enum UserUserType {
  Account = UcenterUserUserType.Account,
  Member = UcenterUserUserType.Member,
}

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
   * 只读
   */
  readonly?: boolean;
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
   * 查询条件
   */
  where?: UserWhereInput;
  /**
   * 排序
   */
  orderBy?: UserOrder;
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
  proTableProps?: ProTableProps<User, Record<string, any>, 'text'>;
  /**
   * 禁用时替换search的显示位置
   */
  suffix?: ReactNode;
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
  /**
   * onChange被占用时使用
   */
  onOriginalChange?: (value?: User) => void;
}

const userInfoQuery = gql(/* GraphQL */`query orgPkgUserInfo($gid: GID!){
  node(id:$gid){
    ... on User{
      id,displayName,contact{email,mobile}
    }
  }
}`);

const userListQuery = gql(/* GraphQL */`query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  users(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        userType,creationType,registerIP,status,comments,contact{email,mobile}
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
            userType,creationType,registerIP,status,comments,contact{email,mobile}
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
        userType,creationType,registerIP,status,comments,contact{email,mobile}
      }
    }
  }
}`);

const UserSelect = (props: UserSelectProps) => {
  const locale = useLocale('UserSelect'),
    autoCompleteRef = useRef<any>(null),
    requestIdRef = useRef(0),
    blurredDuringLoadingRef = useRef(false),
    [info, setInfo] = useState<User>(),
    [loading, setLoading] = useState(false),
    [keyword, setKeyword] = useState<string>(),
    [options, setOptions] = useState<BaseOptionType[]>([]),
    [open, setOpen] = useState(false);

  const setValue = useCallback((original?: User) => {
    if (original) {
      const value = props.changeValue ? original[props.changeValue] : original;
      setInfo(original);
      setKeyword(original.displayName);
      props.onChange?.(value, original);
      props.onOriginalChange?.(original);
    } else {
      setKeyword(undefined);
      setInfo(undefined);
      props.onChange?.();
      props.onOriginalChange?.();
    }
    setOptions([]);
  }, [])

  // 提取搜索逻辑为独立函数
  const executeSearch = async (keywordStr: string) => {
    const os: BaseOptionType[] = [],
      where: UserWhereInput = {
        ...props.where,
        or: [
          { displayNameContains: keywordStr },
          { principalNameContains: keywordStr },
          {
            hasAddressesWith: [
              { emailContains: keywordStr }
            ]
          },
          {
            hasAddressesWith: [
              { mobileContains: keywordStr }
            ]
          }
        ]
      };
    where.userType = props.userType
    if (props.orgRoleId) {
      const result = await paging<OrgRoleUserListQuery, OrgRoleUserListQueryVariables>(orgRoleUserListQuery, {
        roleId: props.orgRoleId,
        first: 20,
        orderBy: props.orderBy,
        where,
      }, 1, { instanceName: instanceName.UCENTER });
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
        gid: gid('Org', props.orgId),
        first: 20,
        orderBy: props.orderBy,
        where,
      }, 1, { instanceName: instanceName.UCENTER });
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
        first: 20,
        orderBy: props.orderBy,
        where,
      }, 1, { instanceName: instanceName.UCENTER });
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
        setKeyword(data?.displayName);
      } else {
        query<OrgPkgUserInfoQuery, OrgPkgUserInfoQueryVariables>(userInfoQuery, {
          gid: gid('User', props.value),
        }, { instanceName: instanceName.UCENTER }).then(result => {
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
                  setKeyword(info?.displayName);
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
      <UserModal
        open={open}
        orgId={props.orgId}
        orgRoleId={props.orgRoleId}
        userType={props.userType}
        title={locale.title}
        where={props.where}
        orderBy={props.orderBy}
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

export default UserSelect;
