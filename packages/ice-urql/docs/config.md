---
sidebar_label: 配置
---

# 配置

`defineUrqlConfig` 配置支持对象和数组

## 参数

在配置的是数组参数时必须设置一个`instanceName="default"`默认的client的配置基于default来实现

| 属性         | 描述                                                                                                                                                                               | 类型                                                                                                          | 必填 | 默认值 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---- | ------ |
| instanceName | 用来寻找client的key                                                                                                                                                                | string                                                                                                        | ✅   | ---    |
| url          | 请求地址                                                                                                                                                                           | string                                                                                                        | ✅   | ---    |
| exchanges    | 自定义exchanges                                                                                                                                                                    | Exchange[]                                                                                                    | ❌   | ---    |
| exchangeOpt  | 可以启用[Authentication](https://formidable.com/open-source/urql/docs/advanced/authentication/)或[mapExchange](https://formidable.com/open-source/urql/docs/api/core/#mapexchange) | {<br/>authOpts?:[AuthExchangeOpts](#authexchangeopts),<br/>mapOpts?:[MapExchangeOpts](#mapexchangeopts)<br/>} | ❌   | ---    |

### MapExchangeOpts

可以直接配置[mapExchange](https://formidable.com/open-source/urql/docs/api/core/#mapexchange)中的`onOperation`、`onResult`、`onError`

### AuthExchangeOpts

| 属性              | 描述                          | 类型                                            | 必填 | 默认值   |
| ----------------- | ----------------------------- | ----------------------------------------------- | ---- | -------- |
| store             | 提供获取数据和设置token的方法 | [AuthExchangeOptsStore](#authexchangeoptsstore) | ✅   | -        |
| refreshApi        | token刷新api                  | string                                          | ✅   | -        |
| login             | 登陆地址                      | string                                          | ❌   | -        |
| loginRedirectKey  | 登陆地址记录当前路由key       | string                                          | ❌   | redirect |
| beforeRefreshTime | 提前多久刷新token             | number                                          | ❌   | 0        |
| error             | 异常处理                      | (error: CombinedError) => boolean               | ❌   | -        |

#### AuthExchangeOptsStore

```ts
{
  getState: () => { token: string; tenantId: string; refreshToken: string; },
  setStateToken: (token: string) => void;
}

```

## 配置参考

### 单对象配置

```ts
import { defineUrqlConfig } from "@knockout-js/ice-urql/esm/types";
import { debugExchange, fetchExchange } from "urql";
import store from "@/store";

// 正常集成
export const urqlConfig = defineUrqlConfig(() => ({
  instanceName: "default",
  url: "https://trygql.formidable.dev/graphql/basic-pokedex",
  exchangeOpt: {
    authOpts: {
      store: {
        getState: () => {
          const { token, tenantId, refreshToken } = store.getModelState("user");
          return {
            token,
            tenantId,
            refreshToken,
          };
        },
        setStateToken: (newToken) => {
          store.dispatch.user.updateToken(newToken);
        },
      },
      login: "/login",
      refreshApi: "/api-auth/login/refresh-token",
    },
  },
}));

// 想要独立处理exchanges
export const urqlConfig = defineUrqlConfig(() => ({
  instanceName: "default",
  url: "https://trygql.formidable.dev/graphql/basic-pokedex",
  exchanges: [fetchExchange, debugExchange],
}));
```

### 数组配置

```ts
import { defineUrqlConfig } from "@knockout-js/ice-urql/esm/types";
import { debugExchange, fetchExchange } from "urql";
import store from "@/store";

export const urqlConfig = defineUrqlConfig(() => [
  {
    instanceName: "default",
    url: "https://trygql.formidable.dev/graphql/basic-pokedex",
    exchangeOpt: {
      authOpts: {
        store: {
          getState: () => {
            const { token, tenantId, refreshToken } =
              store.getModelState("user");
            return {
              token,
              tenantId,
              refreshToken,
            };
          },
          setStateToken: (newToken) => {
            store.dispatch.user.updateToken(newToken);
          },
        },
        login: "/login",
        refreshApi: "/api-auth/login/refresh-token",
      },
    },
  },
  {
    instanceName: "instance2",
    url: "https://trygql.formidable.dev/graphql/basic-pokedex",
    exchanges: [fetchExchange, debugExchange],
  },
]);
```
