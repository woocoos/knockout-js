import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, MenuProps } from 'antd';
import styles from './index.module.css';
import { useLocale } from '../locale';

export interface AvatarDropdownLocale {
  logout: string;
}

interface AvatarDropdownProps {
  name: string;
  avatar: string;
  menu?: MenuProps;
  onMeneActions: (event: { key: string; }) => void;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = (props: AvatarDropdownProps) => {
  const locale = useLocale('AvatarDropdown');

  const onMenuClick = useCallback(props.onMeneActions, []);

  const menu = {
    items: [
      {
        key: 'logout',
        label: locale.logout,
        icon: <LogoutOutlined rev={undefined} />,
        onClick: onMenuClick,
        className: styles.menu,
      },
    ],
  };
  return (
    <Dropdown menu={props.menu || menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={props.avatar}
          alt="avatar"
        />
        <span>{props.name}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
