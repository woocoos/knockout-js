
import { Key, useEffect, useRef, useState } from 'react';
import { ProColumns, ProTable, ProTableProps, RequestData } from '@ant-design/pro-components';
import { App, AppKind, AppOrder, AppListQuery, AppListQueryVariables, AppWhereInput, OrgAppListQuery, OrgAppListQueryVariables } from '@knockout-js/api/ucenter';
import { gid, instanceName } from '@knockout-js/api';
import { useLocale } from '../locale';
import { gql, paging } from '@knockout-js/ice-urql/request';
import { Modal, ModalProps } from '@knockout-js/layout';

export interface AppModalLocale {
  name: string;
  code: string;
  type: string;
  desc: string;
}

export const EnumAppKind = {
  web: { text: 'web' },
  native: { text: 'native' },
  server: { text: 'server' },
};

export interface AppModalProps {
  /**
   * 弹框开关
   */
  open: boolean;
  /**
   * orgId授权的应用
   */
  orgId?: string;
  /**
   * 查询条件
   */
  where?: AppWhereInput;
  /**
   * 排序
   */
  orderBy?: AppOrder;
  /**
   * 弹框标题
   */
  title?: string;
  /**
   * 多选
   */
  isMultiple?: boolean;
  /**
   * ant modal api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<App, Record<string, any>, 'text'>;
  /**
   * 关闭弹框 (data?:App[])=>void
   */
  onClose: (data?: App[]) => void;
}

const orgAppListQuery = gql(/* GraphQL */`query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  node(id:$gid){
    ... on Org{
      id
      apps(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,name,code,kind,comments,status
          }
        }
      }
    }
  }
}`);

const appListQuery = gql(/* GraphQL */`query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  apps(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,code,kind,comments,status
      }
    }
  }
}`);


export default (props: AppModalProps) => {
  const locale = useLocale('AppModal'),
    glocale = useLocale('global'),
    columns: ProColumns<App>[] = [
      // 有需要排序配置  sorter: true
      {
        title: locale.name,
        dataIndex: 'name',
        width: 180,
      },
      {
        title: locale.code,
        dataIndex: 'code',
        width: 120,
      },
      {
        title: locale.type,
        dataIndex: 'kind',
        filters: true,
        search: false,
        width: 100,
        align: 'center',
        valueEnum: EnumAppKind,
      },
      { title: locale.desc, dataIndex: 'comments', search: false },
    ],
    [dataSource, setDataSource] = useState<App[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

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

  return (
    <Modal
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
      <div className="ko-modal-table" ref={modalWrapRef} onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.stopPropagation();
        }
      }}>
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
            const table: Partial<RequestData<App>> = { data: [], success: true, total: 0 },
              where: AppWhereInput = {
                ...props.where,
              };
            where.nameContains = params.name;
            where.codeContains = params.code;
            where.kindIn = filter.kind as AppKind[]
            if (props.orgId) {
              const result = await paging<OrgAppListQuery, OrgAppListQueryVariables>(orgAppListQuery, {
                gid: gid('Org', props.orgId),
                first: params.pageSize,
                orderBy: props.orderBy,
                where,
              }, params.current || 1, { instanceName: instanceName.UCENTER });
              if (result.data?.node?.__typename === 'Org') {
                result.data.node.apps.edges?.forEach((item) => {
                  if (item?.node) {
                    table.data?.push(item.node as App)
                  }
                })
                table.total = result.data.node.apps.totalCount
              }
            } else {
              const result = await paging<AppListQuery, AppListQueryVariables>(appListQuery, {
                first: params.pageSize,
                orderBy: props.orderBy,
                where,
              }, params.current || 1, { instanceName: instanceName.UCENTER });
              if (result.data?.apps.totalCount) {
                result.data.apps.edges?.forEach(item => {
                  if (item?.node) {
                    table.data?.push(item.node as App)
                  }
                })
                table.total = result.data.apps.totalCount
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
    </Modal>
  );
};
