
import { authExchange as urqlAuthExchange } from "@urql/exchange-auth";
import { CombinedError, Exchange } from "urql";
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { message } from 'antd';
import { request } from "@ice/plugin-request/request";

export interface AuthExchangeOpts {
  /**
   * import { createStore } from 'ice'; 的store
   */
  store: any;
  /**
   * 提前多久刷新token默认0
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
   * 异常处理
   * @param error
   * @returns
   */
  error?: (error: CombinedError) => boolean;
}

export function authExchange(handler: AuthExchangeOpts): Exchange {

  const { store, refreshApi, beforeRefreshTime, error, login, loginRedirectKey } = handler

  return urqlAuthExchange(async utilities => {
    return {
      addAuthToOperation(operation) {
        const { token, tenantId } = store.getModelState('user');
        return token
          ? utilities.appendHeaders(operation, {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': `${tenantId}`,
          })
          : operation;
      },
      didAuthError(err) {
        if (err.response.status === 401) {
          if (login) {
            location.href = `${login}?${loginRedirectKey ?? 'redirect'}=${encodeURIComponent(location.href)}`
            return false;
          }
        }
        message.error(err.toString())
        return error?.(err) ?? false;
      },
      async refreshAuth() {
        const { refreshToken } = store.getModelState('user');
        const result = await request.post(refreshApi, {
          refreshToken,
        });
        if (result?.accessToken) {
          store?.dispatch?.user?.updateToken?.(result.accessToken);
        }

      },
      willAuthError() {
        const { token } = store.getModelState('user');
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
