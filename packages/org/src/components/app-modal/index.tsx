
import { Modal, ModalProps } from 'antd';
import { useState } from 'react';
import { ProColumns, ProTable, ProTableProps } from '@ant-design/pro-table';
import { App, AppWhereInput, appListQuery } from '@knockout-js/api';
import { useClient } from 'urql'
import { useLocale } from '../locale';
import { CClient } from '../..';

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
  open: boolean;
  orgId?: string;
  title?: string;
  isMultiple?: boolean;
  modalProps?: ModalProps;
  proTableProps?: ProTableProps<App, Record<string, any>, 'text'>;
  onClose: (data?: App[]) => void;
}


export default (props: AppModalProps) => {
  const locale = useLocale('AppModal'),
    glocale = useLocale('global'),
    client = useClient() as CClient,
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
          }, {
            url: `${client.url}?p=${params.current}`
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
