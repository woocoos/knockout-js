import {
  AnyVariables,
  cacheExchange,
  Client,
  fetchExchange,
  RequestPolicy,
  useQuery,
  UseQueryArgs,
  UseQueryResponse
} from 'urql';
import { CustomClientOptions, RequestConfig } from "./types";
import { authExchange } from "@urql/exchange-auth";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TENANT_ID_KEY = 'X-Tenant-ID';

export interface AuthHandler {
  getToken: () => Promise<string | undefined>;
  getRefreshToken: () => Promise<string | undefined>;
  getTenantId: () => Promise<string | undefined>;
  refresh: (refreshToken: string) => Promise<{ token: string, refreshToken: string } | undefined>;
  saveAuthData: (data: { token: string; refreshToken: string }) => void;
  // This is where auth has gone wrong and we need to clean up and redirect to a login page
  clearStorage: () => void;
}

function initAuthExchange(authHandler: AuthHandler) {
  const {getToken, getRefreshToken, getTenantId, refresh, saveAuthData, clearStorage} = authHandler

  return authExchange(async utilities => {
    let token = await getToken();
    let refreshToken = await getRefreshToken();
    let tenant = await getTenantId();
    return {
      addAuthToOperation(operation) {
        return token
          ? utilities.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
            TENANT_ID_KEY: `${tenant}`,
          })
          : operation;
      },
      didAuthError(error) {
        return error.response.status === 401;
      },
      willAuthError(operation) {
        getToken().then((t) => {
          token = t;
        });
        getRefreshToken().then((t) => {
          refreshToken = t;
        });
        // jwt check
        if (token) {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          if (tokenData.exp * 1000 < Date.now()) {
            return true;
          }
        }
        return !token;

      },
      async refreshAuth() {
        if (refreshToken) {
          const result = await refresh(refreshToken);

          if (result) {
            token = result.token;
            refreshToken = result.refreshToken;
            saveAuthData({token, refreshToken});
            return;
          }
        }

        clearStorage();
        window.location.reload();
      },
    };
  });
}


const defaultClientOptions = {
  url: '/graphql/query',
  requestPolicy: 'cache-and-network' as RequestPolicy,
  exchanges: [
    cacheExchange,
    fetchExchange,
  ],
}

interface UrqlInstances {
  default: Client;
  configs: { [key: string]: CustomClientOptions };
}

const urqlInstances = {} as UrqlInstances;

export function createUrqlInstance(config: RequestConfig, instanceName?: string) {
  if (instanceName) {
    if (urqlInstances.configs[instanceName]) {
      return urqlInstances
    }
    if (instanceName === 'default') {
      let opts = defaultClientOptions && config as CustomClientOptions;
      urqlInstances.default = new Client(opts);
    }
    urqlInstances.configs[instanceName] = config as CustomClientOptions;
  }
  return urqlInstances;
}

export type useClient = typeof useQuery;

export function useRequest<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(instanceName: string, args: UseQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables> {
  args.context = {url: urqlInstances.configs[instanceName].url, ...args.context};
  return useQuery(args);
}
