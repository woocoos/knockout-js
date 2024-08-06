import { defineDataLoader } from '@ice/runtime';
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig, requestInterceptor } from "@knockout-js/ice-urql/types";
import store from './store';
import { RequestHeaderAuthorizationMode } from '@knockout-js/ice-urql/request';
import { instanceName } from '@knockout-js/api';

const ICE_DEV_TOKEN = process.env.ICE_DEV_TOKEN ?? '',
  ICE_DEV_TID = process.env.ICE_DEV_TID ?? '',
  ICE_UCENTER_URL = process.env.ICE_UCENTER_URL ?? '',
  ICE_MSG_URL = process.env.ICE_MSG_URL ?? '',
  ICE_MSG_WS_URL = process.env.ICE_MSG_WS_URL ?? ''
// ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',


export default {
  app: {
    rootId: 'app',
  },
};

export const dataLoader = defineDataLoader(async () => {
  console.log('defineDataLoader')
  return {
    user: {
      token: ICE_DEV_TOKEN,
      tenantId: ICE_DEV_TID,
      refreshToken: 'refreshToken',
      user: {
        id: "1",
        displayName: 'test name',
      },
    }
  }
});

export const urqlConfig = defineUrqlConfig([
  {
    instanceName: 'default',
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    exchangeOpt: {
      subOpts: {
        url: ICE_MSG_WS_URL,
        store: {
          getState: () => {
            const { token, tenantId } = store.getModelState('user')
            return {
              token: token ?? ICE_DEV_TOKEN,
              tenantId: tenantId ?? ICE_DEV_TID
            }
          },
        }
      },
      authOpts: {
        // headerMode: RequestHeaderAuthorizationMode.KO,
        store: {
          getState: () => {
            const { token, tenantId, refreshToken } = store.getModelState('user')
            return {
              token: token ?? ICE_DEV_TOKEN,
              tenantId: tenantId ?? ICE_DEV_TID,
              refreshToken
            }
          },
          setStateToken: (newToken) => {
            store.dispatch.user.updateToken(newToken)
          }
        },
        login: '/login',
        refreshApi: "/api-auth/login/refresh-token"
      }
    }
  },
  {
    instanceName: 'instance2',
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  },
  {
    instanceName: instanceName.UCENTER,
    url: ICE_UCENTER_URL,
  },
  {
    instanceName: instanceName.MSGCENTER,
    url: ICE_MSG_URL,
  },
])

// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  console.log('defineAuthConfig')
  const { user } = appData,
    initialAuth = {};
  return {
    initialAuth,
  };
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  console.log('defineStoreConfig')
  const { user } = appData;
  return {
    initialStates: {
      user,
    },
  };
});


// 请求配置
export const requestConfig = defineRequestConfig(() => {
  console.log('defineRequestConfig')
  return {
    interceptors: requestInterceptor({
      store: {
        getState: () => {
          return {
            token: ICE_DEV_TOKEN,
            tenantId: ICE_DEV_TID
          }
        }
      },
      login: '/login'
    }),
  }
});


