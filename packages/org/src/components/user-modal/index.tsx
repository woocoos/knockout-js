import { OrgRoleUserListQuery, OrgRoleUserListQueryVariables, OrgUserListQuery, OrgUserListQueryVariables, User, UserListQuery, UserListQueryVariables, UserSimpleStatus, UserUserType, UserWhereInput, gid } from "@knockout-js/api";
import { gql, useClient } from "urql";
import { useLocale } from "../locale";
import { CClient } from "../..";
import { useState } from "react";
import ProTable, { ProColumns, ProTableProps } from "@ant-design/pro-table";
import { Modal, ModalProps } from "antd";

export interface UserModalLocale {
  principal_name: string;
  display_name: string;
  email: string;
  mobile: string;
  status: string;
  created_at: string;
}

export interface UserModalProps {
  open: boolean;
  title: string;
  userType?: UserUserType;
  isMultiple?: boolean;
  orgId?: string;
  orgRoleId?: string;
  modalProps?: ModalProps;
  proTableProps?: ProTableProps<User, Record<string, any>, 'text'>;
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

export default (props: UserModalProps) => {
  const locale = useLocale('UserModal'),
    glocale = useLocale('global'),
    client = useClient() as CClient,
    [dataSource, setDataSource] = useState<User[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    columns: ProColumns<User>[] = [
      {
        title: locale.principal_name,
        dataIndex: 'principalName',
        width: 90,
      },
      {
        title: locale.display_name,
        dataIndex: 'displayName',
        width: 120,
      },
      {
        title: locale.email,
        dataIndex: 'email',
        width: 120,
      },
      {
        title: locale.mobile,
        dataIndex: 'mobile',
        width: 160,
      },
      {
        title: locale.status,
        dataIndex: 'status',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumUserStatus,
      },
      { title: locale.created_at, dataIndex: 'createdAt', width: 160, valueType: 'dateTime' },
    ]

  return <Modal
    width={900}
    title={props.title}
    {...props.modalProps}
    open={props.open}
    onOk={() => {
      props.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)));
    }}
    onCancel={() => {
      props.onClose();
    }}
  >
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
        const table = { data: [] as User[], success: true, total: 0 },
          where: UserWhereInput = {};
        where.userType = props.userType;
        where.principalNameContains = params.principalName;
        where.displayNameContains = params.displayName;
        where.emailContains = params.email;
        where.mobileContains = params.mobile;
        where.statusIn = filter.status as UserSimpleStatus[] | null;
        if (props.orgRoleId) {
          const result = await client.query<OrgRoleUserListQuery, OrgRoleUserListQueryVariables>(orgRoleUserListQuery, {
            roleId: props.orgRoleId,
            first: params.pageSize,
            where,
          }, {
            url: `${client.url}?p=${params.current}`,
          }).toPromise();
          if (result.data?.orgRoleUsers.totalCount) {
            result.data.orgRoleUsers.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as User)
              }
            })
            table.total = result.data.orgRoleUsers.totalCount
          }
        } else if (props.orgId) {
          const result = await client.query<OrgUserListQuery, OrgUserListQueryVariables>(orgUserListQuery, {
            gid: gid('org', props.orgId),
            first: params.pageSize,
            where,
          }, {
            url: `${client.url}?p=${params.current}`,
          }).toPromise();
          if (result.data?.node?.__typename === 'Org') {
            result.data.node.users.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as User)
              }
            })
            table.total = result.data.node.users.totalCount
          }
        } else {
          const result = await client.query<UserListQuery, UserListQueryVariables>(userListQuery, {
            first: params.pageSize,
            where,
          }, {
            url: `${client.url}?p=${params.current}`,
          }).toPromise();
          if (result.data?.users.totalCount) {
            result.data.users.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as User)
              }
            })
            table.total = result.data.users.totalCount
          }
        }

        setDataSource(table.data)
        return table
      }}
      pagination={{ showSizeChanger: true }}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys) => {
          setSelectedRowKeys(selectedRowKeys as string[]);
        },
        type: props.isMultiple ? 'checkbox' : 'radio',
      }}
      onRow={(record) => {
        return {
          onClick: () => {
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
          },
        };
      }}
    />
  </Modal>;
}