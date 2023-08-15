import { defineDataLoader } from '@ice/runtime';
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig, requestInterceptor } from "@knockout-js/ice-urql/esm/types";
import store from './store';
import { userPermissions } from '@knockout-js/api';

export default {
  app: {
    rootId: 'app',
  },
};

export const dataLoader = defineDataLoader(async () => {
  return {
    user: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2OTEzOTcwMDB9.OxViESAOpW8J1pqMVCE0ObOg7nu2-um9SCXn7gR2bdY',
      tenantId: '1',
      refreshToken: 'refreshToken',
      user: null,
    }
  }
});

export const urqlConfig = defineUrqlConfig([
  {
    instanceName: 'default',
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    // exchangeOpt: {
    //   authOpts: {
    //     store: {
    //       getState: () => {
    //         const { token, tenantId, refreshToken } = store.getModelState('user')
    //         return {
    //           token, tenantId, refreshToken
    //         }
    //       },
    //       setStateToken: (newToken) => {
    //         store.dispatch.user.updateToken(newToken)
    //       }
    //     },
    //     login: '/login',
    //     refreshApi: "/api-auth/login/refresh-token"
    //   }
    // }
  },
  {
    instanceName: 'instance2',
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  },
  {
    instanceName: 'ucenter',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  },
])

// 权限
export const authConfig = defineAuthConfig(async (appData) => {
  const { user } = appData,
    initialAuth = {};
  // 判断路由权限
  if (user.token) {
    const result = await userPermissions("test");
    if (result) {
      result.forEach(item => {
        if (item) {
          initialAuth[item.name] = true;
        }
      });
    }
  }
  return {
    initialAuth,
  };
});

// store数据项
export const storeConfig = defineStoreConfig(async (appData) => {
  const { user } = appData;
  return {
    initialStates: {
      user,
    },
  };
});

// 请求配置
export const requestConfig = defineRequestConfig(() => ({
  baseURL: '/',
  interceptors: requestInterceptor({
    store: {
      getState: () => {
        const { token, tenantId } = store.getModelState('user')
        return {
          token, tenantId
        }
      }
    },
    login: '/login'
  })
}));
