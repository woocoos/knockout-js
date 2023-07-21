import { Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { SearchProps } from "antd/lib/input";
import OrgModal from './modal';
import { Org } from '@knockout-js/api';
import { useTranslation } from 'react-i18next';
import { CloseCircleFilled } from '@ant-design/icons';

export interface OrgInputProps {
  value: Org;
  disabled: boolean;
  orgId: string;
  searchProps: SearchProps;
  onChange: (value?: Org) => void;
}

const OrgInput = (props: OrgInputProps) => {
  const { t } = useTranslation(),
    [open, setOpen] = useState(false);

  return (
    <>
      <Input.Search
        placeholder={`${t('org.input.placeholder')}`}
        {...props.searchProps}
        value={props.value?.name}
        disabled={props.disabled}
        suffix={props.value && props.disabled != true ? <CloseCircleFilled
          style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            props.onChange?.();
          }} rev={undefined} /> : <span />}
        onSearch={() => {
          setOpen(true);
        }}
      />
      <OrgModal
        open={open}
        orgId={props.orgId}
        title={`${t('org.modal.title')}`}
        onClose={(data) => {
          props.onChange?.(data?.[0])
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgInput;
