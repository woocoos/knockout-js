
import { authExchange as urqlAuthExchange } from "@urql/exchange-auth";
import { CombinedError, Exchange } from "urql";
import jwtDcode, { JwtPayload } from 'jwt-decode';

export interface AuthExchangeOpts {
  /**
   * 提前多久刷新token默认0
   */
  beforeRefreshTime?: number;
  /**
   * 初始化token,tenantId,refreshToken
   * @returns
   */
  storage: () => Promise<{
    token: string;
    tenantId: string;
    refreshToken: string;
  }>;
  /**
   * token刷新
   * @param refreshToken
   * @returns
   */
  refresh: (refreshToken: string) => Promise<{ token: string } | undefined>;
  /**
   * 异常处理
   * @param error
   * @returns
   */
  error?: (error: CombinedError) => boolean;
}

export function authExchange(handler: AuthExchangeOpts): Exchange {

  const { storage, refresh, beforeRefreshTime, error } = handler

  return urqlAuthExchange(async utilities => {
    const store = await storage();
    let token = store.token;
    let tenantId = store.tenantId;
    let refreshToken = store.refreshToken;
    return {
      addAuthToOperation(operation) {
        return token
          ? utilities.appendHeaders(operation, {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': `${tenantId}`,
          })
          : operation;
      },
      didAuthError(err) {
        return error?.(err) || false;
      },
      async refreshAuth() {
        const result = await refresh(refreshToken);
        if (result?.token) {
          token = result.token;
        }
      },
      willAuthError() {
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
