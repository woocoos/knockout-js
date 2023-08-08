import { defineDataLoader } from '@ice/runtime';
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { defineUrqlConfig } from "@knockout-js/ice-urql/esm/types";
import { debugExchange, fetchExchange } from "urql";

export const dataLader = defineDataLoader(async () => {
  console.log('dataLader');
});

export default {
  app: {
    rootId: 'app',
  },
};

export const dataLoader = defineDataLoader(async () => {
});

export const urqlConfig = defineUrqlConfig(() => [
  {
    instanceName: 'default',
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    exchangeOpt: {
      authOpts: {
        storage: async () => {
          return {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2OTEzOTcwMDB9.OxViESAOpW8J1pqMVCE0ObOg7nu2-um9SCXn7gR2bdY',
            tenantId: '1',
            refreshToken: 'refreshToken',
          }
        },
        refresh: async (refreshToken) => {
          return {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2OTEzOTQzMDB9.NSE6Vkgt-2BTe5iJWgsnRzQKO_aMx0W38qCddHSgO5o',
          }
        },
        error: (err) => {
          alert(err.toString())
          return err.response.status === 401
        }
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
])

export const requestConfig = defineRequestConfig(() => ({
  //   // 可选的，全局设置 request 是否返回 response 对象，默认为 false
  //   withFullResponse: false,
  //   baseURL: '/api',
  //   headers: {},
  //   // 其它 RequestConfig 参数

  //   // 拦截器
  //   interceptors: {
  //     request: {
  //       onConfig: (config) => {
  //         // 发送请求前：可以对 RequestConfig 做一些统一处理
  //         config.headers = {a: 1};
  //         return config;
  //       },
  //       onError: (error) => {
  //         return Promise.reject(error);
  //       },
  //     },
  //     response: {
  //       onConfig: (response) => {
  //         console.log(response);
  //         // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
  //         if (response.data.status === 1) {
  //           alert('请求失败');
  //         }
  //         return response;
  //       },
  //       onError: (error) => {
  //         // MOCK DATA for `/api/user`
  //         if (error.config.url === '/api/user') {
  //           return new Promise((resolve) => {
  //             setTimeout(() => {
  //               error.response.data = {
  //                 name: 'ICE',
  //                 age: 26,
  //               };
  //               resolve(error.response);
  //             }, 1000);
  //           });
  //         }
  //         // 请求出错：服务端返回错误状态码
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //         return Promise.reject(error);
  //       },
  //     },
  //   },
}));
