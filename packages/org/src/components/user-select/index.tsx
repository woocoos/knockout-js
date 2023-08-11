import { Input, ModalProps } from 'antd';
import { useState } from 'react';
import { SearchProps } from "antd/lib/input";
import UserModal from '../user-modal';
import { User, UserUserType } from '@knockout-js/api';
import { CloseCircleFilled } from '@ant-design/icons';
import { useLocale } from '../locale';
import { ProTableProps } from '@ant-design/pro-table';

export interface UserSelectLocale {
  placeholder: string;
  title: string;
}

export interface UserSelectProps {
  /**
   * 值
   */
  value?: User;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * orgId的用户
   */
  orgId?: string;
  /**
   * orgRoleId的用户
   */
  orgRoleId?: string;
  /**
   * 过滤用户类型
   */
  userType?: UserUserType;
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
  proTableProps?: ProTableProps<User, Record<string, any>, 'text'>;
  /**
   * 值变更事件  (value?: User) => void;
   */
  onChange?: (value?: User) => void;
}

const OrgSelect = (props: UserSelectProps) => {
  const locale = useLocale('UserSelect'),
    [open, setOpen] = useState(false);

  return (
    <>
      <Input.Search
        placeholder={locale.placeholder}
        {...props.searchProps}
        value={props.value?.displayName}
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
      <UserModal
        open={open}
        orgId={props.orgId}
        orgRoleId={props.orgRoleId}
        userType={props.userType}
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
