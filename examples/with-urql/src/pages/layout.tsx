import { Outlet, useLocation } from '@ice/runtime';
import { Layout, LocaleType } from '@knockout-js/layout';
import { history } from 'ice';
import { useState } from 'react';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { Org } from '@knockout-js/api';

export default () => {
  const location = useLocation(),
    [tenantId, setTenantId] = useState('1'),
    [darkMode, setDarkMode] = useState(false),
    [user] = useState<{
      id: string,
      displayName: string,
    }>({
      id: '1',
      displayName: 'admin',
    }),
    [, setLocale] = useState<LocaleType>(LocaleType.zhCN),
    tenantList = [
      { id: '1', name: 'tenant 1' },
    ]

  const userMenuList = async () => {
    return []
  }

  return (
    <Layout
      appCode="adminx"
      pathname={location.pathname}
      onClickMenuItem={(item, isOpen) => {
        if (isOpen) {
          window.open(item.path ?? '');
        } else {
          history?.push(item.path ?? '');
        }
      }}
      tenantProps={{
        value: tenantId,
        dataSource: tenantList as Org[],
        onChange: (value) => {
          setTenantId(value);
        },
      }}
      i18nProps={{
        onChange: (value) => {
          setLocale(value);
        },
      }}
      avatarProps={{
        avatar: defaultAvatar,
        name: user?.displayName,
      }}
      themeSwitchProps={{
        value: darkMode,
        onChange: (value) => {
          setDarkMode(value);
        },
      }}
      proLayoutProps={{
        [process.env.ICE_CORE_MODE === 'development' ? 'menu' : '']: {
          request: userMenuList
        }
      }}
    >
      <Outlet />
    </Layout>
  );
};

export function pageConfig() {
  return {
    title: 'Layout',
    meta: [
      {
        name: 'layout-color',
        content: '#f00',
      },
    ],
  };
}
