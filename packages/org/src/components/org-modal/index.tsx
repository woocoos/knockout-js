import { useState } from 'react';
import { ProColumns, ProTable, ProTableProps } from '@ant-design/pro-table';
import { AppOrgListQuery, AppOrgListQueryVariables, OrderDirection, Org, OrgKind, OrgListQuery, OrgListQueryVariables, OrgOrderField, OrgWhereInput } from "@knockout-js/api/ucenter";
import { gid, instanceName } from "@knockout-js/api";
import { useLocale } from '../locale';
import { gql, paging } from '@knockout-js/ice-urql/request';
import { Modal, ModalProps } from '@knockout-js/layout';

export interface OrgModalLocale {
  name: string;
  code: string;
  domain: string;
  owner: string;
  desc: string;
}

export interface OrgModalProps {
  /**
  * 弹框开关
  */
  open: boolean;
  /**
  * 弹框标题
  */
  title?: string;
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
   * 多选
   */
  isMultiple?: boolean;
  /**
   * ant ModalProps api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
  /**
   * 关闭弹框 (data?: Org[]) => void;
   */
  onClose: (data?: Org[]) => void;
}

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

export default (props: OrgModalProps) => {
  const locale = useLocale('OrgModal'),
    glocale = useLocale('global'),
    [dataSource, setDataSource] = useState<Org[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    columns: ProColumns<Org>[] = [
      {
        title: locale.name,
        dataIndex: 'name',
      },
      {
        title: locale.domain,
        dataIndex: 'domain',
      },
      {
        title: locale.owner,
        dataIndex: 'owner',
        search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>;
        },
      },
      { title: locale.desc, dataIndex: 'profile', search: false },
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
      request={async (params) => {
        const table = { data: [] as Org[], success: true, total: 0 },
          where: OrgWhereInput = {},
          orderBy = {
            direction: OrderDirection.Asc,
            field: OrgOrderField.DisplaySort,
          };
        where.kind = props.kind;
        where.nameContains = params.name;
        where.domain = params.domain;
        where.pathHasPrefix = props.orgId ? `${props.orgId}/` : undefined
        if (props.appId) {
          const result = await paging<AppOrgListQuery, AppOrgListQueryVariables>(appOrgListQuery, {
            gid: gid('app', props.appId),
            first: params.pageSize,
            where,
            orderBy,
          }, params.current || 1, { instanceName: instanceName.UCENTER });
          if (result.data?.node?.__typename === 'App') {
            result.data.node.orgs.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as Org)
              }
            })
            table.total = result.data.node.orgs.totalCount
          }
        } else {
          const result = await paging<OrgListQuery, OrgListQueryVariables>(orgListQuery, {
            first: params.pageSize,
            where,
            orderBy,
          }, params.current || 1, { instanceName: instanceName.UCENTER });
          if (result.data?.organizations.totalCount) {
            result.data.organizations.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as Org)
              }
            })
            table.total = result.data.organizations.totalCount
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


