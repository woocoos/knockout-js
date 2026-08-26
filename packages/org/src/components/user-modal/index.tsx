import { OrgRoleUserListQuery, OrgRoleUserListQueryVariables, OrgUserListQuery, OrgUserListQueryVariables, User, UserListQuery, UserListQueryVariables, UserOrder, UserSimpleStatus, UserUserType as UcenterUserUserType, UserWhereInput } from "@knockout-js/api/ucenter";
import { gid, instanceName } from "@knockout-js/api";
import { useLocale } from "../locale";
import { Key, useEffect, useRef, useState } from "react";
import { ProTable, ProColumns, ProTableProps, RequestData } from "@ant-design/pro-components";
import { gql, paging } from '@knockout-js/ice-urql/request';
import { Modal, ModalProps } from "@knockout-js/layout";

// fix publish error: Property 'userType' of exported interface has or is using private name 'UserUserType'
enum UserUserType {
  Account = UcenterUserUserType.Account,
  Member = UcenterUserUserType.Member,
}

export interface UserModalLocale {
  principal_name: string;
  display_name: string;
  email: string;
  mobile: string;
  status: string;
  created_at: string;
}

export interface UserModalProps {
  /**
   * 显示弹框
   */
  open: boolean;
  /**
   * 弹框标题
   */
  title: string;
  /**
   * 类型过滤
   */
  userType?: UserUserType;
  /**
   * 多选
   */
  isMultiple?: boolean;
  /**
   * orgId下的用户
   */
  orgId?: string;
  /**
   * orgRoleId下的用户
   */
  orgRoleId?: string;
  /**
   * 查询条件
   */
  where?: UserWhereInput;
  /**
   * 排序
   */
  orderBy?: UserOrder;
  /**
   * ant ModalProps api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<User, Record<string, any>, 'text'>;
  /**
   * 关闭弹框事件 (selectData?: User[]) => void;
   */
  onClose: (selectData?: User[]) => void;
}

export const EnumUserStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};


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

export default (props: UserModalProps) => {
  const locale = useLocale('UserModal'),
    glocale = useLocale('global'),
    [dataSource, setDataSource] = useState<User[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]),
    columns: ProColumns<User>[] = [
      {
        title: locale.principal_name,
        dataIndex: 'principalName',
        width: 120,
      },
      {
        title: locale.display_name,
        dataIndex: 'displayName',
        width: 150,
      },
      {
        title: locale.mobile,
        dataIndex: 'mobile',
        width: 160,
        renderText(_text, record) {
          return <div>{record.contact?.mobile}</div>;
        },
      },
      {
        title: locale.email,
        dataIndex: 'email',
        renderText(_text, record) {
          return <div>{record.contact?.email}</div>;
        },
      },
    ]

  const modalWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'Enter') {
        // 仅当当前 Modal 处于最顶层时才响应，避免多弹窗干扰
        const wrap = modalWrapRef.current?.closest('.ant-modal-wrap') as HTMLElement | null;
        if (wrap) {
          const allWraps = Array.from(document.querySelectorAll<HTMLElement>('.ant-modal-wrap'))
            .filter(el => el.style.display !== 'none' && getComputedStyle(el).display !== 'none');
          const maxZ = Math.max(...allWraps.map(el => Number(el.style.zIndex) || 0));
          const currentZ = Number(wrap.style.zIndex) || 0;
          if (currentZ < maxZ) return;
        }
        props.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id ?? '')));
      }
      return false;
    }
    document.addEventListener('keydown', onKeydown, false);
    return () => {
      document.removeEventListener('keydown', onKeydown, false);
    }
  }, [selectedRowKeys, dataSource]);

  return <Modal
    width={900}
    title={props.title}
    {...props.modalProps}
    open={props.open}
    okText={<span>确定(Alt+↵)</span>}
    onOk={() => {
      props.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id ?? '')));
    }}
    onCancel={() => {
      props.onClose();
    }}
  >
    <div className="ko-modal-table" ref={modalWrapRef}>
      <ProTable
        size="small"
        scroll={{ x: 'max-content', y: 300 }}
        {...props.proTableProps}
        rowKey={'id'}
        search={{
          searchText: glocale.query,
          resetText: glocale.reset,
          labelWidth: 'auto',
        }}
        options={false}
        columns={columns}
        request={async (params, sort, filter) => {
          setSelectedRowKeys([])
          const table: Partial<RequestData<User>> = { data: [], success: true, total: 0 },
            where: UserWhereInput = {
              ...props.where,
            };
          where.userType = props.userType;
          where.principalNameContains = params.principalName;
          where.displayNameContains = params.displayName;
          if (params.email || params.mobile) {
            where.hasAddressesWith = [];
            if (params.email) {
              where.hasAddressesWith.push(
                { emailContains: params.email }
              )
            }
            if (params.mobile) {
              where.hasAddressesWith.push(
                { mobileContains: params.mobile }
              )
            }
          }
          where.statusIn = filter.status as UserSimpleStatus[] | null;
          if (props.orgRoleId) {
            const result = await paging<OrgRoleUserListQuery, OrgRoleUserListQueryVariables>(orgRoleUserListQuery, {
              roleId: props.orgRoleId,
              first: params.pageSize,
              orderBy: props.orderBy,
              where,
            }, params.current || 1, { instanceName: instanceName.UCENTER });
            if (result.data?.orgRoleUsers.totalCount) {
              result.data.orgRoleUsers.edges?.forEach(item => {
                if (item?.node) {
                  table.data?.push(item.node as User)
                }
              })
              table.total = result.data.orgRoleUsers.totalCount
            }
          } else if (props.orgId) {
            const result = await paging<OrgUserListQuery, OrgUserListQueryVariables>(orgUserListQuery, {
              gid: gid('Org', props.orgId),
              first: params.pageSize,
              orderBy: props.orderBy,
              where,
            }, params.current || 1, { instanceName: instanceName.UCENTER });
            if (result.data?.node?.__typename === 'Org') {
              result.data.node.users.edges?.forEach(item => {
                if (item?.node) {
                  table.data?.push(item.node as User)
                }
              })
              table.total = result.data.node.users.totalCount
            }
          } else {
            const result = await paging<UserListQuery, UserListQueryVariables>(userListQuery, {
              first: params.pageSize,
              orderBy: props.orderBy,
              where,
            }, params.current || 1, { instanceName: instanceName.UCENTER });
            if (result.data?.users.totalCount) {
              result.data.users.edges?.forEach(item => {
                if (item?.node) {
                  table.data?.push(item.node as User)
                }
              })
              table.total = result.data.users.totalCount
            }
          }

          setDataSource(table.data ?? [])
          if (!props.isMultiple && table.data?.[0]?.id) {
            setSelectedRowKeys([table.data[0].id])
          }
          return table
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          type: props.isMultiple ? 'checkbox' : 'radio',
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.id) {
                if (props.isMultiple) {
                  if (selectedRowKeys.includes(record.id)) {
                    setSelectedRowKeys(selectedRowKeys.filter(id => id != record.id));
                  } else {
                    selectedRowKeys.push(record.id);
                    setSelectedRowKeys([...selectedRowKeys]);
                  }
                } else {
                  setSelectedRowKeys([record.id]);
                }
              }
            },
          };
        }}
      />
    </div>
  </Modal>;
}
