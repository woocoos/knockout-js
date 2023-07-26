
import { Modal } from 'antd';
import { useState } from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-table';
// import defaultApp from '@/assets/images/default-app.png';
import { App, AppKind, AppWhereInput, appListQuery } from '@knockout-js/api';
import { useClient } from 'urql'
import { useLocale } from '../locale';

export const EnumAppKind = {
  web: { text: 'web' },
  native: { text: 'native' },
  server: { text: 'server' },
};

export default (props: {
  open: boolean;
  isMultiple?: boolean;
  title: string;
  tableTitle?: string;
  onClose: (selectData?: App[]) => void;
}) => {
  const locale = useLocale('AppSelect'),
    glocale = useLocale('global'),
    client = useClient(),
    columns: ProColumns<App>[] = [
      // 有需要排序配置  sorter: true
      {
        title: locale.name,
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      {
        title: locale.code,
        dataIndex: 'code',
        width: 120,
        search: {
          transform: (value) => ({ codeContains: value || undefined }),
        },
      },
      {
        title: locale.type,
        dataIndex: 'kind',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumAppKind,
      },
      { title: locale.desc, dataIndex: 'comments', width: 160, search: false },
    ],
    [dataSource, setDataSource] = useState<App[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const
    // getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
    //   const table = { data: [] as App[], success: true, total: 0 },
    //     where: AppWhereInput = {};
    //   where.nameContains = params.nameContains;
    //   where.codeContains = params.codeContains;
    //   where.kindIn = filter.kind as AppKind[];

    //   const result = await getAppList({
    //     current: params.current,
    //     pageSize: params.pageSize,
    //     where,
    //   });
    //   if (result?.totalCount) {
    //     table.data = result.edges?.map(item => item?.node) as App[];
    //     table.data = await formatArrayFilesRaw(table.data, "logo", defaultApp)
    //     table.total = result.totalCount;
    //   }
    //   setSelectedRowKeys([]);
    //   setDataSource(table.data);
    //   return table;
    // },
    handleOk = () => {
      props?.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)));
    },
    handleCancel = () => {
      props?.onClose();
    };

  return (
    <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
      <ProTable
        rowKey={'id'}
        size="small"
        search={{
          searchText: glocale.query,
          resetText: glocale.reset,
          labelWidth: 'auto',
        }}
        options={false}
        scroll={{ x: 'max-content', y: 300 }}
        columns={columns}
        request={async (params) => {
          const table = { data: [] as App[], success: true, total: 0 },
            where: AppWhereInput = {};
          const result = await client.query(appListQuery, {
            first: params.pageSize,
            where,
          }).toPromise();
          if (result.data?.apps.totalCount) {
            result.data.apps.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as App)
              }
            })
            table.total = result.data.apps.totalCount
          }
          setDataSource(table.data)
          return table
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys) => { setSelectedRowKeys(selectedRowKeys as string[]); },
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
    </Modal>
  );
};
