
import { authExchange as urqlAuthExchange } from "@urql/exchange-auth";
import { Exchange } from "urql";
import jwtDcode, { JwtPayload } from 'jwt-decode';

export interface AuthHandler {
  getStorage: () => Promise<{
    token: string;
    tenantId: string;
    refreshToken: string;
  }>
  refresh: (refreshToken: string) => Promise<{ token: string } | undefined>;
}

export function authExchange(handler: AuthHandler): Exchange {

  const { getStorage, refresh } = handler

  return urqlAuthExchange(async utilities => {
    const store = await getStorage();
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
      didAuthError(error) {
        return error.response.status === 401;
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
          if ((jwt.exp || 0) * 1000 < Date.now()) {
            return true;
          }
        }
        return false;
      },

    };
  });
}
