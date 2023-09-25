import { useCallback } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, MenuProps } from 'antd';
import styles from './index.module.css';
import { useLocale } from '../locale';

export interface AvatarDropdownLocale {
  logout: string;
}

export interface AvatarDropdownProps {
  /**
   * 用户名
   */
  name?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * ant的
   */
  menuProps?: MenuProps;
  /**
   * 单击退出事件 () => void;
   */
  onLogoutClick?: () => void;
}

const AvatarDropdown = (props: AvatarDropdownProps) => {
  const locale = useLocale('AvatarDropdown'),
    menu = {
      items: [
        {
          key: 'logout',
          label: locale.logout,
          icon: <LogoutOutlined rev={undefined} />,
          onClick: useCallback(() => {
            props.onLogoutClick?.()
          }, []),
          className: styles.menu,
        },
      ],
    };

  return (
    <Dropdown menu={props.menuProps || menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          icon={<UserOutlined rev={undefined} />}
          src={props.avatar}
          alt="avatar"
        />
        <span>{props.name}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
