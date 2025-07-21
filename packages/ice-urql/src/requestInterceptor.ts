import { Interceptors } from "@ice/plugin-request";
import type { AxiosError, AxiosResponse } from "axios";

interface ReqInterceptorOpts {
  /**
   * 签名模式
   */
  headerMode?: RequestHeaderAuthorizationMode;
  store: {
    /**
     * 获取需要的数据
     * @returns
     */
    getState: () => {
      token: string;
      tenantId: string;
    },
  };
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
  error?: (error: AxiosError | AxiosResponse, errStr?: string) => void;
}

/**
 * defineRequestConfig 的默认配置 拦截器
 * @param option
 * @returns
 */
export const requestInterceptor = (option: ReqInterceptorOpts) => {
  const { store, login, loginRedirectKey, error, headerMode, tenantIdExtendKeys } = option;
  const result: Interceptors = {
    request: {
      onConfig(config) {
        const { token, tenantId } = store.getState();
        if (config.headers) {
          if (!config.headers['Authorization']) {
            config.headers['Authorization'] = token ? getRequestHeaderAuthorization(token, headerMode) : ''
          }
          if (!config.headers['X-Tenant-ID'] && tenantId) {
            config.headers['X-Tenant-ID'] = `${tenantId}`
          }
          if (tenantId && tenantIdExtendKeys?.length) {
            tenantIdExtendKeys.forEach(key => {
              if (!config.headers) {
                config.headers = {}
              }
              config.headers[key] = `${tenantId}`;
            })
          }
        }
        return config;
      },
    },
    response: {
      onConfig(response) {
        if (response?.status === 200 && response?.data?.errors) {
          // 提取第一个异常来展示
          if (response.data.errors?.[0]?.message) {
            error?.(response as AxiosResponse, response.data.errors?.[0]?.message)
          }
        }
        return response;
      },
      onError: async (err) => {
        if (err?.response?.status === 401) {
          if (login) {
            goLogin(login, loginRedirectKey);
          }
        }

        const errRes = err?.response as AxiosResponse<{
          errors: { message: string }[]
        }, any>
        let msg = errRes?.statusText;
        if (errRes?.data?.errors?.[0]?.message) {
          msg = errRes?.data?.errors?.[0]?.message;
        }

        error?.(err as AxiosError, msg)
        return Promise.reject(err);
      },
    },
  }

  return result;
}


/**
 * 统一loginUrl的处理
 * @param loginUrl
 */
export function goLogin(loginUrl: string, loginRedirectKey?: string) {
  if (loginUrl.toLowerCase().startsWith("http")) {
    const url = new URL(loginUrl);
    if (location.pathname !== url.pathname || location.host != url.host) {
      location.href = `${loginUrl}?${loginRedirectKey ?? 'redirect'}=${encodeURIComponent(location.href)}`
    }
  } else {
    if (location.pathname !== loginUrl) {
      location.href = `${loginUrl}?${loginRedirectKey ?? 'redirect'}=${encodeURIComponent(location.href)}`
    }
  }
}

/**
 * 签名模式
 */
export enum RequestHeaderAuthorizationMode {
  KO = "ko_hmac"
}

/**
 * 随机数
 * @param length
 * @returns
 */
function randomString(length: number) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

/**
 * 根据不同模式获取请求头Authorization的处理
 * @param token
 * @param mode
 * @returns
 */
export function getRequestHeaderAuthorization(token: string, mode?: RequestHeaderAuthorizationMode) {
  const accessToken = `Bearer ${token}`;
  if (mode === RequestHeaderAuthorizationMode.KO) {
    const timestamp = (Date.now() / 1000).toFixed(0),
      separator = ', ',
      nonce = randomString(10),
      signatures: string[] = [];
    signatures.push(`noncestr=${nonce}`);
    signatures.push(`timestamp=${timestamp}`);
    signatures.push(`accessToken=${accessToken}`);
    signatures.push(`url=${location.href.split('#')[0]}`);
    const signature = signatures.sort((d1, d2) => d1 > d2 ? 1 : d1 < d2 ? -1 : 0).join('&');
    return `KO-HMAC-SHA1 timestamp=${timestamp}${separator}nonce=${nonce}${separator}Signature=${CryptoJS.SHA1(
      signature,
    )}`
  }
  return accessToken;
}
