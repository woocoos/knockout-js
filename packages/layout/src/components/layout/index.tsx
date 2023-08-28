import { MenuDataItem, ProLayout, ProLayoutProps } from '@ant-design/pro-layout';
import I18nDropdown, { I18nDropdownProps } from '../i18n-dropdown';
import TenantDropdown, { TenantDropdownProps } from '../tenant-dropdown';
import AvatarDropdown, { AvatarDropdownProps } from '../avatar-dropdown';
import ThemeSwitch, { ThemeSwitchProps } from '../theme-switch';
import styles from './layout.module.css';
import { ReactNode, useCallback, useState } from 'react';
import { UserMenuListQuery, UserMenuListQueryVariables } from '@knockout-js/api';
import { LocaleType } from '../locale';
import { CollectProviders } from '..';
import { gql, query } from '@knockout-js/ice-urql/request';
import { iceUrqlInstance } from '..';
import { OpenWin } from '../icons';
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont';
import { logoBase64 } from './logo';
import GatherMenu, { GatherMenuProps } from '../gather-menu';
import { BarsOutlined } from '@ant-design/icons';

export interface LayoutProps {
  /**
   * 应用code
   */
  appCode: string;
  /**
   * 传递动态的 location.pathname
   */
  pathname: string;
  /**
   * 菜单启用iconfont
   */
  IconFont?: React.FC<IconFontProps<string>>;
  /**
   * 集成菜单
   */
  gatherMenuProps?: GatherMenuProps;
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
  children?: ReactNode;

}

const userMenuListQuery = gql(/* GraphQL */`query userMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,parentID,kind,name,comments,displaySort,icon,route
  }
}`);


const Layout = (props: LayoutProps) => {

  const [locale, setLocale] = useState(LocaleType.zhCN);
  const [open, setOpen] = useState(false);

  // 根据列表格式化成菜单树结构
  const listFormatTree = useCallback((list: MenuDataItem[], parentList?: MenuDataItem[]) => {
    if (!parentList) {
      parentList = list.filter(item => item.parentId == '0');
    }
    parentList.forEach((pItem) => {
      let children = list.filter(
        (allItem) => allItem.parentId == pItem.key,
      );
      if (children && children.length) {
        pItem.children = listFormatTree(list, children);
      }
    });
    return parentList;
  }, [])

  const isGatherMenu = !!props.gatherMenuProps;

  return (
    <CollectProviders
      locale={locale}
      dark={props.themeSwitchProps.value}
      pathname={props.pathname}
    >
      <ProLayout
        className={styles.layout}
        headerTitleRender={(logo, title) => {
          return <>
            {isGatherMenu ? <BarsOutlined
              rev={undefined}
              style={{ fontSize: 20, marginRight: 10 }}
              onClick={() => {
                setOpen(true);
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
        menu={isGatherMenu ? <></> : {
          locale: true,
          request: async () => {
            const result = await query<UserMenuListQuery, UserMenuListQueryVariables>(userMenuListQuery, {
              appCode: props.appCode
            }, { instanceName: iceUrqlInstance.ucenter });
            if (result.data?.userMenus.length) {
              const meunList = result.data.userMenus.map(item => {
                return {
                  key: item.id,
                  name: item.name,
                  icon: item.icon ? props.IconFont ? <props.IconFont type={item.icon} /> : <i className={item.icon} /> : undefined,
                  parentId: item.parentID,
                  path: item.route,
                } as MenuDataItem
              })

              return listFormatTree(meunList);
            }
            return [];
          },
        }}
        location={{
          pathname: props.pathname
        }}
        actionsRender={() => [
          <I18nDropdown onChange={(value) => {
            setLocale(value);
            props.i18nProps?.onChange?.(value)
          }} />,
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
      <GatherMenu
        {...props.gatherMenuProps}
        open={open}
        onChangeOpen={setOpen}
      />
    </CollectProviders>
  )
}

export default Layout
