import { Input } from 'antd';
import { useState } from 'react';
import { SearchProps } from "antd/lib/input";
import OrgModal from './modal';
import { Org } from '@knockout-js/api';
import { CloseCircleFilled } from '@ant-design/icons';
import { useLocale } from '../locale';

export interface OrgInputProps {
  value: Org;
  disabled: boolean;
  orgId: string;
  searchProps: SearchProps;
  onChange: (value?: Org) => void;
}

const OrgInput = (props: OrgInputProps) => {
  const locale = useLocale('OrgInput'),
    [open, setOpen] = useState(false);

  return (
    <>
      <Input.Search
        placeholder={locale.placeholder}
        {...props.searchProps}
        value={props.value?.name}
        disabled={props.disabled}
        suffix={props.value && !props.disabled ? <CloseCircleFilled
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
        title={locale.title}
        onClose={(data) => {
          props.onChange?.(data?.[0])
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgInput;
