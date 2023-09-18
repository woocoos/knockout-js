import { Outlet, useLocation } from '@ice/runtime';
import { Layout } from '@knockout-js/layout';
import { history } from 'ice';
import { useEffect } from 'react';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { monitorKeyChange } from '@/pkg/localStore';
import store from '@/store';
import { Org } from '@knockout-js/api/esm/gql/ucenter/graphql';

export default () => {
  const location = useLocation(),
    [userState, userDispatcher] = store.useModel('user'),
    [appState, appDispatcher] = store.useModel('app'),
    tenantList = [
      { id: '1', name: 'tenant 1' },
      { id: '2', name: 'tenant 2' },
    ]

  useEffect(() => {
    monitorKeyChange([
      {
        key: 'tenantId',
        onChange(value) {
          userDispatcher.updateTenantId(value);
        },
      },
      {
        key: 'token',
        onChange(value) {
          userDispatcher.updateToken(value);
        },
      },
      {
        key: 'user',
        onChange(value) {
          userDispatcher.updateUser(value);
        },
      },
      {
        key: 'locale',
        onChange(value) {
          appDispatcher.updateLocale(value);
        },
      },
    ]);
  }, []);

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
        value: userState.tenantId,
        dataSource: tenantList as Org[],
        onChange: (value) => {
          userDispatcher.updateTenantId(value);
        },
      }}
      i18nProps={{
        onChange: (value) => {
          appDispatcher.updateLocale(value);
        },
      }}
      avatarProps={{
        avatar: defaultAvatar,
        name: userState.user?.displayName,
      }}
      themeSwitchProps={{
        value: appState.darkMode,
        onChange: (value) => {
          appDispatcher.updateDarkMode(value);
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
