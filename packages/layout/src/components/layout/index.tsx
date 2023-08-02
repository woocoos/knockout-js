import { MenuDataItem, ProLayout, ProLayoutProps } from '@ant-design/pro-layout';
import I18nDropdown, { I18nDropdownProps } from '../i18n-dropdown';
import TenantDropdown, { TenantDropdownProps } from '../tenant-dropdown';
import AvatarDropdown, { AvatarDropdownProps } from '../avatar-dropdown';
import ThemeSwitch, { ThemeSwitchProps } from '../theme-switch';
import { ProConfigProvider } from '@ant-design/pro-provider';
import styles from './layout.module.css';
import { ReactNode } from 'react';
import { AliveScope } from "react-activation";
import { NodeExpandOutlined } from '@ant-design/icons';


export interface LayoutProps {
  /**
   * I18nDropdown组件对应的参数
   */
  i18nProps: I18nDropdownProps;
  /**
   * TenantDropdown组件对应的参数
   */
  tenantProps: TenantDropdownProps;
  /**
   * AvatarDropdown组件对应的参数
   */
  avatarProps: AvatarDropdownProps;
  /**
   * ThemeSwitch组件对应的参数
   */
  themeSwitchProps: ThemeSwitchProps;
  /**
  * ProLayout组件对应的参数
  */
  proLayoutProps?: ProLayoutProps;
  /**
   * 菜单点击返回 (item: MenuDataItem,isOpen?: boolean) => void;
   */
  onClickMenuItem?: (item: MenuDataItem & {
    isUrl: boolean;
    onClick: () => void;
  },
    isOpen?: boolean) => void;
  /**
   * 默认插槽
   */
  children: ReactNode;
}

function Layout(props: LayoutProps) {

  const loadMenu = async () => {
    return [];
  }

  return <ProConfigProvider dark={props.themeSwitchProps.value}>
    <ProLayout
      className={styles.layout}
      layout="mix"
      fixSiderbar
      menu={{
        locale: true,
        request: loadMenu,
      }}
      actionsRender={() => [
        <I18nDropdown {...props.i18nProps} />,
        <TenantDropdown {...props.tenantProps} />,
        <AvatarDropdown {...props.avatarProps} />,
        <ThemeSwitch {...props.themeSwitchProps} />,
      ]}
      menuItemRender={(item, defaultDom) => (item.path ? <>
        <a
          onClick={() => {
            props.onClickMenuItem?.(item, false)
          }}
        >{defaultDom}</a>
        <NodeExpandOutlined
          className={styles.menuIconPopup}
          onClick={() => {
            props.onClickMenuItem?.(item, true)
          }}
          rev={undefined} />
      </>
        : defaultDom)}
      {...props.proLayoutProps}
    >
      <AliveScope>
        {props.children}
      </AliveScope>
    </ProLayout>
  </ProConfigProvider>
}

export default Layout
