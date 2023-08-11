import { Input, ModalProps } from 'antd';
import { useState } from 'react';
import { SearchProps } from "antd/lib/input";
import OrgModal from '../org-modal';
import { Org, OrgKind } from '@knockout-js/api';
import { CloseCircleFilled } from '@ant-design/icons';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-table';

export interface OrgSelectLocale {
  placeholder: string;
  title: string;
}

export interface OrgSelectProps {
  /**
   * 值
   */
  value?: Org;
  /**
   * 禁用
   */
  disabled?: boolean;
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
   * ant SearchProps api
   */
  searchProps?: SearchProps;
  /**
   * ant ModalProps api
   */
  modalProps?: ModalProps;
  /**
   * ProTable api
   */
  proTableProps?: ProTableProps<Org, Record<string, any>, 'text'>;
  /**
   * 值变更事件 (value?: Org) => void;
   */
  onChange?: (value?: Org) => void;
}

const OrgSelect = (props: OrgSelectProps) => {
  const locale = useLocale('OrgSelect'),
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
        appId={props.appId}
        kind={props.kind}
        title={locale.title}
        modalProps={props.modalProps}
        proTableProps={props.proTableProps}
        onClose={(data) => {
          props.onChange?.(data?.[0])
          setOpen(false);
        }}
      />
    </>
  )
}

export default OrgSelect;
