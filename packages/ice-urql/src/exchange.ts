
import { authExchange as urqlAuthExchange, } from "@urql/exchange-auth";
import { CombinedError, Exchange, subscriptionExchange as urqlSubscriptionExchange } from "urql";
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { request } from "@ice/plugin-request/request";
import { createClient as wsClient } from 'graphql-ws';
import { RequestHeaderAuthorizationMode, getRequestHeaderAuthorization, goLogin } from "./requestInterceptor.js";

export interface AuthExchangeOpts {
  store: {
    /**
     * 获取需要的数据
     * @returns
     */
    getState: () => {
      token: string;
      tenantId: string;
      refreshToken: string;
    },
    /**
     * 更新token后外部可获取处理
     * @param token
     * @returns
     */
    setStateToken: (token: string) => void;
  };
  /**
   * 签名模式
   */
  headerMode?: RequestHeaderAuthorizationMode;
  /**
   * 提前多久刷新token默认0
   * 单位是毫秒
   */
  beforeRefreshTime?: number;
  /**
   * token刷新api
   */
  refreshApi: string;
  /**
   * 登陆地址
   */
  login?: string;
  /**
   * 登陆地址记录当前路由key
   * 默认值：redirect
   */
  loginRedirectKey?: string;
  /**
   * 在header上扩展租户id的key 兼容旧版本
   */
  tenantIdExtendKeys?: string[];
  /**
   * 异常处理
   * @param error
   * @returns
   */
  error?: (error: CombinedError, errStr?: string) => boolean;
}

/**
 * 身份验证相关的exchange
 * @param handler
 * @returns
 */
export function authExchange(handler: AuthExchangeOpts): Exchange {

  const { store, beforeRefreshTime, refreshApi, tenantIdExtendKeys, login, loginRedirectKey, error, headerMode } = handler

  return urqlAuthExchange(async utilities => {
    return {
      addAuthToOperation(operation) {
        const { token, tenantId } = store.getState(), headers: Record<string, string> = {};
        const fetchOptions = operation.context.fetchOptions
        if (typeof fetchOptions != 'function') {
          const fetchHeaders = fetchOptions?.headers as Record<string, string> | undefined;
          if (!fetchHeaders?.['Authorization'] && token) {
            headers['Authorization'] = getRequestHeaderAuthorization(token, headerMode);
          }
          if (!fetchHeaders?.['X-Tenant-ID'] && tenantId) {
            headers['X-Tenant-ID'] = `${tenantId}`;
          }
          if (tenantId && tenantIdExtendKeys?.length) {
            tenantIdExtendKeys.forEach(key => {
              headers[key] = `${tenantId}`;
            })
          }
        }
        return utilities.appendHeaders(operation, headers);
      },
      didAuthError(err) {
        if (err?.response?.status === 401) {
          if (login) {
            goLogin(login, loginRedirectKey);
            return false;
          }
        }
        return error?.(err, err.toString().replace('[Network] ', '').replace('[GraphQL] ', '')) ?? false;
      },
      async refreshAuth() {
        const { refreshToken } = store.getState();
        const result = await request.post(refreshApi, {
          refreshToken,
        });
        if (result?.accessToken) {
          store.setStateToken(result.accessToken);
        }
      },
      willAuthError() {
        const { token } = store.getState();
        if (token) {
          const jwt = jwtDcode<JwtPayload>(token);
          if (((jwt.exp || 0) * 1000 - (beforeRefreshTime || 0)) < Date.now()) {
            return true;
          }
        }
        return false;
      },
    };
  });
}

export interface SubExchangeOpts {
  /**
   * 链接socket的地址
   */
  url: string;
  store: {
    /**
     * 获取需要的数据
     * @returns
     */
    getState: () => {
      token: string;
      tenantId: string;
      appCode?: string;
      deviceId?: string;
    },
  };
}

/**
 * 订阅相关的exchange
 * @param handler
 * @returns
 */
export function subExchange(handler: SubExchangeOpts): Exchange {
  const { url, store } = handler,
    createClient = () => {
      return wsClient({
        url,
        connectionParams: () => {
          const { token, tenantId, appCode, deviceId } = store.getState();
          cacheToken = token;
          return {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
            appCode,
            deviceId,
          }
        }
      })
    };

  let cacheToken = '',
    wsc = createClient();

  return urqlSubscriptionExchange({
    forwardSubscription(request) {
      const { token } = store.getState();
      if (cacheToken && cacheToken !== token) {
        wsc = createClient();
      }
      const input = { ...request, query: request.query || '' };
      return {
        subscribe(sink) {
          const unsubscribe = wsc.subscribe(input, sink);
          return { unsubscribe };
        },
      };
    },
  })
}

