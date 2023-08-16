# 其他

## requestInterceptor

提供了一个快速配置`defineRequestConfig`的处理方法


### 配置参数

| 属性             | 描述                    | 类型                                                | 必填 | 默认值   |
| ---------------- | ----------------------- | --------------------------------------------------- | ---- | -------- |
| store            | 提供获取数据            | {getState: () => {token: string;tenantId: string;}} | ✅    | -        |
| login            | 登陆地址                | string                                              | ❌    | -        |
| loginRedirectKey | 登陆地址记录当前路由key | string                                              | ❌    | redirect |
| error            | 异常处理                | (error: AxiosError) => void                         | ❌    | -        |

### 用例
```ts title=app.ts
import { defineRequestConfig } from '@ice/plugin-request/esm/types';
import { requestInterceptor } from "@knockout-js/ice-urql/types";

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
```
