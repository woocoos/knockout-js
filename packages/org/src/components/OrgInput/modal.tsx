import {Modal, ModalProps} from 'antd';
import React from 'react';
import {ProColumns, ProTable} from '@ant-design/pro-table';
import {Org} from "@knockout-js/api";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
export interface OrgModalProps extends ModalProps {
  isMultiple?: boolean;
}

const OrgModal: React.FC<OrgModalProps> = (props: OrgModalProps) => {
  const { t } = useTranslation();
  const {...restProps} = props;


  return <Modal {...restProps}>
    <ProTable rowKey={'id'} columns={columns(t)}
    />
  </Modal>;
}

function columns(t:TFunction): ProColumns<Org>[] {
  return [
    {
      title: t('org.modal.name'),
      dataIndex: 'name',
      width: 120,
      search: {
        transform: (value) => ({nameContains: value || undefined}),
      },
    },
    {
      title: t('org.modal.domain'),
      dataIndex: 'domain',
      width: 120,
      search: {
        transform: (value) => ({codeContains: value || undefined}),
      },
    },
    {
      title: t('org.modal.owner'),
      dataIndex: 'owner',
      width: 120,
      search: false,
      render: (text, record) => {
        return <div>{record?.owner?.displayName || '-'}</div>;
      },
    },
    {title: t('org.modal.desc'), dataIndex: 'profile', width: 160, search: false},
  ]
}

export default OrgModal;
