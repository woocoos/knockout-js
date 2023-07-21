import { Modal, ModalProps } from 'antd';
import React, { useState } from 'react';
import { ProColumns, ProTable, ProTableProps } from '@ant-design/pro-table';
import { Org, OrgWhereInput, orgListQuery } from "@knockout-js/api";
import { useTranslation } from "react-i18next";
import { useClient } from 'urql'

export interface OrgModalProps {
  open: boolean;
  orgId: string;
  title?: string;
  isMultiple?: boolean;
  modalProps?: ModalProps;
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
  onClose: (data?: Org[]) => void;
}

export default (props: OrgModalProps) => {
  const { t } = useTranslation(),
    client = useClient(),
    [dataSource, setDataSource] = useState<Org[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    columns: ProColumns<Org>[] = [
      {
        title: t('org.modal.name'),
        dataIndex: 'name',
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      {
        title: t('org.modal.domain'),
        dataIndex: 'domain',
        search: {
          transform: (value) => ({ codeContains: value || undefined }),
        },
      },
      {
        title: t('org.modal.owner'),
        dataIndex: 'owner',
        search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>;
        },
      },
      { title: t('org.modal.desc'), dataIndex: 'profile', search: false },
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
        searchText: `${t('query')}`,
        resetText: `${t('reset')}`,
        labelWidth: 'auto',
      }}
      options={false}
      columns={columns}
      request={async (params) => {
        const table = { data: [] as Org[], success: true, total: 0 },
          where: OrgWhereInput = {};
        const result = await client.query(orgListQuery, {
          first: params.pageSize,
          where,
        }).toPromise();
        if (result.data?.organizations.totalCount) {
          result.data.organizations.edges?.forEach(item => {
            if (item?.node) {
              table.data.push(item.node as Org)
            }
          })
          table.total = result.data.organizations.totalCount
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


