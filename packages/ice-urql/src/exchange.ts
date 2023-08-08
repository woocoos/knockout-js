
import { authExchange as urqlAuthExchange } from "@urql/exchange-auth";
import { CombinedError, Exchange } from "urql";
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { message } from 'antd';
import { request } from "@ice/plugin-request/request";

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

export function authExchange(handler: AuthExchangeOpts) {

  const { store, beforeRefreshTime, refreshApi, login, loginRedirectKey, error } = handler

  return urqlAuthExchange(async utilities => {
    return {
      addAuthToOperation(operation) {
        const { token, tenantId } = store.getState();
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
