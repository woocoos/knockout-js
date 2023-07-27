import { Modal, ModalProps } from 'antd';
import { useState } from 'react';
import { ProColumns, ProTable, ProTableProps } from '@ant-design/pro-table';
import { OrderDirection, Org, OrgKind, OrgOrder, OrgOrderField, OrgWhereInput, gid, orgListQuery } from "@knockout-js/api";
import { gql, useClient } from 'urql'
import { useLocale } from '../locale';
import { CClient } from '../..';

export interface OrgModalLocale {
  name: string;
  code: string;
  domain: string;
  owner: string;
  desc: string;
}

export interface OrgModalProps {
  open: boolean;
  title?: string;
  orgId?: string;
  appId?: string;
  kind: OrgKind;
  isMultiple?: boolean;
  modalProps?: ModalProps;
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
  onClose: (data?: Org[]) => void;
}

const appOrgListQuery = gql<{
  node: {
    __typename?: 'App',
    id: string;
    orgs: {
      totalCount: number;
      edges: {
        cursor: string;
        // node: Org;
        node: {
          id: string, ownerID?: string, parentID: string, kind: OrgKind,
          domain?: string, code?: string, name: string, profile?: string, displaySort: number, countryCode?: string, timezone?: string,
          owner: { id: string, displayName: string }
        }
      }[]
    }
  }
}, {
  gid: string;
  first?: number;
  orderBy?: OrgOrder;
  where?: OrgWhereInput;
}>(/* GraphQL */`query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  node(id:$gid){
    ... on App{
      id,
      orgs(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,ownerID,parentID,kind,
            domain,code,name,profile,displaySort,countryCode,timezone,
            owner { id,displayName }
          }
        }
      }
    }
  }
}`);

export default (props: OrgModalProps) => {
  const locale = useLocale('OrgModal'),
    glocale = useLocale('global'),
    client = useClient() as CClient,
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
          const result = await client.query(appOrgListQuery, {
            gid: gid('app', props.appId),
            first: params.pageSize,
            where,
            orderBy,
          }, {
            url: `${client.url}?p=${params.current}`,
          }).toPromise();
          if (result.data?.node?.__typename === 'App') {
            result.data.node.orgs.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as Org)
              }
            })
            table.total = result.data.node.orgs.totalCount
          }
        } else {
          const result = await client.query(orgListQuery, {
            first: params.pageSize,
            where,
            orderBy,
          }, {
            url: `${client.url}?p=${params.current}`,
          }).toPromise();
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


