import { defineDataLoader } from '@ice/runtime';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig } from "@knockout-js/ice-urql/esm/types";
import { debugExchange, fetchExchange } from "urql";
import store from '@/store';

export default {
  app: {
    rootId: 'app',
  },
};

export const dataLoader = defineDataLoader(async () => {
  console.log('defineDataLoader')
  return {
    user: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2OTEzOTcwMDB9.OxViESAOpW8J1pqMVCE0ObOg7nu2-um9SCXn7gR2bdY',
      tenantId: '1',
      refreshToken: 'refreshToken',
      user: null,
    }
  }
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

export const urqlConfig = defineUrqlConfig(async () => {
  console.log('defineUrqlConfig')

  return [
    {
      instanceName: 'default',
      url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
      exchangeOpt: {
        authOpts: {
          store: {
            getState: () => {
              const { token, tenantId, refreshToken } = store.getModelState('user')
              return {
                token, tenantId, refreshToken
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
      exchanges: [
        fetchExchange,
        debugExchange,
      ],
    },
  ]
})

export const requestConfig = defineRequestConfig(() => ({
  baseURL: '/',
}));
