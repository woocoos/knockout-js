import { Input } from 'antd';
import ModalApp from './modal';
import { useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { App } from '@knockout-js/api';
import { useLocale } from '../locale';

export interface AppSelectLocale {
  placeholder: string;
  title: string;
  name: string;
  code: string;
  type: string;
  desc: string;
}

export default (props: {
  value?: App;
  disabled?: boolean;
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
        value={props.value?.name || ''}
        disabled={props.disabled}
        placeholder={locale.placeholder}
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
