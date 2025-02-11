import { MenuDataItem, ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import I18nDropdown, { I18nDropdownProps } from '../i18n-dropdown';
import TenantDropdown, { TenantDropdownProps } from '../tenant-dropdown';
import AvatarDropdown, { AvatarDropdownProps } from '../avatar-dropdown';
import MsgDropdown, { MsgDropdownProps, MsgDropdownRef } from '../msg-dropdown';
import ThemeSwitch, { ThemeSwitchProps } from '../theme-switch';
import styles from './layout.module.css';
import { ReactNode, FC, Ref, useRef, useImperativeHandle } from 'react';
import { UserMenuListQuery, UserMenuListQueryVariables } from '@knockout-js/api/ucenter';
import { CollectProviders, LocaleType } from '..';
import { gql, query } from '@knockout-js/ice-urql/request';
import { OpenWin } from '../icons';
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont';
import { logoBase64 } from './logo';
import AggregateMenu, { AggregateMenuProps } from '../aggregate-menu';
import { BarsOutlined } from '@ant-design/icons';
import { listFormatTreeData } from '../_util';
import { instanceName } from '@knockout-js/api';

export interface LayoutProps {
  /**
   * 应用code
   */
  appCode: string;
  /**
   * 语言
   * 默认 LocaleType.zhCN
   */
  locale?: LocaleType;
  /**
   * 传递动态的 location.pathname
   */
  pathname: string;
  /**
   * 菜单启用iconfont
   */
  IconFont?: FC<IconFontProps<string>>;
  /**
   * 聚合菜单
   */
  aggregateMenuProps?: AggregateMenuProps;
  /**
   * I18nDropdown组件对应的参数
   */
  i18nProps?: I18nDropdownProps;
  /**
   * TenantDropdown组件对应的参数
   */
  tenantProps: TenantDropdownProps;
  /**
   * AvatarDropdown组件对应的参数
   */
  avatarProps: AvatarDropdownProps;
  /**
   * MsgDropdown组件的高级方法
   */
  msgRef?: Ref<MsgDropdownRef>
  /**
   * MsgDropdown组件对应的参数
   */
  msgProps?: MsgDropdownProps;
  /**
   * ThemeSwitch组件对应的参数
   */
  themeSwitchProps?: ThemeSwitchProps;
  /**
  * ProLayout组件对应的参数
  */
  proLayoutProps?: ProLayoutProps;
  /**
   * 顶部插槽，往前语言切换前面添加
   */
  actionsBeforeRender?: ReactNode[];
  /**
   * 菜单点击返回 (item: MenuDataItem,isOpen?: boolean) => void;
   */
  onClickMenuItem?: (
    item: MenuDataItem & {
      isUrl: boolean;
      onClick: () => void;
    },
    isOpen?: boolean
  ) => void;
  /**
   * 默认插槽
   */
  children?: ReactNode;

}

const userMenuListQuery = gql(/* GraphQL */`query userMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,parentID,kind,name,comments,displaySort,icon,route
  }
}`);


const Layout = (props: LayoutProps) => {

  const msgRef = useRef<MsgDropdownRef>(null);

  useImperativeHandle(props.msgRef, () => msgRef.current as MsgDropdownRef);

  return (
    <CollectProviders
      locale={props.locale ?? LocaleType.zhCN}
      appCode={props.appCode}
      tenantId={props.tenantProps.value}
      dark={props.themeSwitchProps?.value ?? false}
      pathname={props.pathname}
    >
      <ProLayout
        className={styles.layout}
        headerTitleRender={(logo, title) => {
          return <>
            {typeof props.aggregateMenuProps?.open === 'boolean' ? <BarsOutlined
              rev={undefined}
              style={{ fontSize: 20, marginRight: 10 }}
              onClick={() => {
                props.aggregateMenuProps?.onChangeOpen?.(true);
              }}
            /> : <></>}
            {logo}
            {title}
          </>
        }}
        title='adminx'
        logo={<img src={logoBase64} alt="logo" />}
        layout="mix"
        fixSiderbar
        suppressSiderWhenMenuEmpty
        menu={{
          locale: true,
          request: async () => {
            const result = await query<UserMenuListQuery, UserMenuListQueryVariables>(userMenuListQuery, {
              appCode: props.appCode
            }, { instanceName: instanceName.UCENTER });
            if (result.data?.userMenus.length) {
              const meunList = result.data.userMenus.sort((d1, d2) => {
                const d1Sort = d1.displaySort || 0, d2Sort = d2.displaySort || 0;
                return d1.parentID < d2.parentID ? -1 : d1.parentID > d2.parentID ? 1 : d1Sort < d2Sort ? -1 : d1Sort > d2Sort ? 1 : 0;
              }).map(item => {
                return {
                  key: item.id,
                  name: item.name,
                  icon: item.icon ? props.IconFont ? <props.IconFont type={item.icon} /> : <i className={item.icon} /> : undefined,
                  parentId: item.parentID,
                  path: item.route,
                } as MenuDataItem
              })

              return listFormatTreeData(meunList);
            }
            return [];
          },
        }}
        location={{
          pathname: props.pathname
        }}
        actionsRender={() => {
          const actions: ReactNode[] = [];
          if (props.actionsBeforeRender) {
            actions.push(...props.actionsBeforeRender);
          }
          if (props.i18nProps) {
            actions.push(<I18nDropdown {...props.i18nProps} />)
          }
          if (props.msgProps) {
            actions.push(<MsgDropdown  {...props.msgProps} ref={msgRef} />)
          }
          actions.push(<TenantDropdown {...props.tenantProps} />)
          actions.push(<AvatarDropdown {...props.avatarProps} />)
          if (props.themeSwitchProps && !props.themeSwitchProps.isHide) {
            actions.push(<ThemeSwitch {...props.themeSwitchProps} />)
          }
          return actions;
        }}
        menuItemRender={(item, defaultDom) => (item.path ? <>
          <a
            onClick={() => {
              props.onClickMenuItem?.(item, false)
            }}
          >{defaultDom}</a>
          <OpenWin
            className={styles.menuIconPopup}
            onClick={() => {
              props.onClickMenuItem?.(item, true)
            }}
          />
        </>
          : defaultDom)}
        {...props.proLayoutProps}
      >
        {props.children}
      </ProLayout>
      {
        props.aggregateMenuProps ? <AggregateMenu
          {...props.aggregateMenuProps}
        /> : <></>
      }
    </CollectProviders>
  )
}

export default Layout
