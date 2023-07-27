import { Input, ModalProps } from 'antd';
import ModalApp from '../app-modal';
import { useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { App } from '@knockout-js/api';
import { useLocale } from '../locale';
import { SearchProps } from 'antd/es/input';
import { ProTableProps } from '@ant-design/pro-table';

export interface AppSelectLocale {
  placeholder: string;
  title: string;
}

export default (props: {
  value?: App;
  disabled?: boolean;
  orgId?: string;
  searchProps?: SearchProps;
  modalProps?: ModalProps;
  proTableProps?: ProTableProps<App, Record<string, any>, 'text'>;
  onChange?: (value?: App) => void;
}) => {
  const locale = useLocale('AppSelect'),
    [modal, setModal] = useState<{
      open: boolean;
    }>({
      open: false,
    });

  return (
    <>
      <Input.Search
        placeholder={locale.placeholder}
        {...props.searchProps}
        value={props.value?.name || ''}
        disabled={props.disabled}
        suffix={props.value && props.disabled != true ? <CloseCircleFilled
          style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            props.onChange?.(undefined);
          }}
          rev={undefined}
        /> : <span />}
        onSearch={() => {
          modal.open = true;
          setModal({ ...modal });
        }}
      />
      <ModalApp
        open={modal.open}
        title={locale.title}
        modalProps={props.modalProps}
        proTableProps={props.proTableProps}
        orgId={props.orgId}
        onClose={(selectData) => {
          if (selectData?.length) {
            props.onChange?.(selectData[0]);
          }
          modal.open = false;
          setModal({ ...modal });
        }}
      />
    </>
  );
};
