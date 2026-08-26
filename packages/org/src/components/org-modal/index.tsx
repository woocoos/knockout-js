import { Key, useEffect, useRef, useState } from 'react';
import { ProColumns, ProTable, ProTableProps, RequestData } from '@ant-design/pro-components';
import { gid, instanceName } from "@knockout-js/api";
import { AppOrgListQuery, AppOrgListQueryVariables, OrderDirection, Org, OrgKind as UcenterOrgKind, OrgListQuery, OrgListQueryVariables, OrgOrder, OrgOrderField, OrgWhereInput } from "@knockout-js/api/ucenter";
import { useLocale } from '../locale';
import { gql, paging } from '@knockout-js/ice-urql/request';
import { Modal, ModalProps } from '@knockout-js/layout';

// fix publish error: Property 'kind' of exported interface has or is using private name 'OrgKind'.
enum OrgKind {
  Org = UcenterOrgKind.Org,
  Root = UcenterOrgKind.Root,
};

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
   * 查询条件
   */
  where?: OrgWhereInput;
  /**
   * 排序，默认按 DisplaySort 升序
   */
  orderBy?: OrgOrder;
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
    [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]),
    columns: ProColumns<Org>[] = [
      {
        title: locale.name,
        dataIndex: 'name',
        width: 150,
      },
      {
        title: locale.code,
        dataIndex: 'code',
        width: 150,
      },
      {
        title: locale.domain,
        dataIndex: 'domain',
        width: 150,
        search: false,
      },
      {
        title: locale.owner,
        dataIndex: 'owner',
        search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>;
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
        request={async (params) => {
          setSelectedRowKeys([])
          const table: Partial<RequestData<Org>> = { data: [], success: true, total: 0 },
            where: OrgWhereInput = {
              ...props.where,
            },
            orderBy = props.orderBy ?? {
              direction: OrderDirection.Asc,
              field: OrgOrderField.DisplaySort,
            };
          where.kind = props.kind;
          where.nameContains = params.name;
          where.domain = params.domain;
          where.pathHasPrefix = props.orgId ? `${props.orgId}/` : undefined
          if (props.appId) {
            const result = await paging<AppOrgListQuery, AppOrgListQueryVariables>(appOrgListQuery, {
              gid: gid('App', props.appId),
              first: params.pageSize,
              where,
              orderBy,
            }, params.current || 1, { instanceName: instanceName.UCENTER });
            if (result.data?.node?.__typename === 'App') {
              result.data.node.orgs.edges?.forEach(item => {
                if (item?.node) {
                  table.data?.push(item.node as Org)
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
                  table.data?.push(item.node as Org)
                }
              })
              table.total = result.data.organizations.totalCount
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


