import { Interceptors } from "@ice/plugin-request";
import type { AxiosError, AxiosResponse } from "axios";
import { i18n } from 'i18next';
import { CombinedError } from "urql";
import { sprintf } from 'sprintf-js';

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
    /**
     * 获取i18n实例
     */
    getI18n?: () => i18n
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
            error?.(response as AxiosResponse, koErrorFormat(response as AxiosResponse, store.getI18n?.()))
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
        error?.(err as AxiosError, koErrorFormat(err as AxiosError<KoAxiosError, any>, store.getI18n?.()))
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

export interface KoErr {
  code?: string | number;
  message?: string;
  meta?: Record<string, string | number> | (string | number)[];
}

/**
 * 针对ko的异常进行处理
 * @param error
 * @param i18nlang
 * @returns
 */
export const KoErrFormat = (error?: KoErr, i18nlang?: i18n) => {
  if (!error) {
    return undefined
  }
  let msg: string | undefined,
    i18nData: {
      [key: string]: string;
    } | undefined;
  if (i18nlang) {
    i18nData = i18nlang?.getDataByLanguage(i18nlang.language)?.['translation']
  }
  if (error.code && i18nData?.[error.code]) {
    if (error.meta) {
      if (Array.isArray(error.meta)) {
        msg = sprintf(i18nData?.[error.code], ...error.meta)
      }
    } else {
      msg = i18nData?.[error.code]
    }
  } else if (error.message && error.meta) {
    if (Array.isArray(error.meta)) {
      msg = sprintf(error.message, ...error.meta)
    } else if (i18nlang) {
      msg = i18nlang.t(error.message, error.meta).toString()
    }
  } else if (error.message) {
    if (i18nlang) {
      msg = i18nlang.t(error.message).toString()
    } else {
      msg = error.message
    }
  }
  return msg
}

export interface KoAxiosError {
  errors?: KoErr[];
}

/**
 * 对请求异常进行处理
 * @param error
 * @param errorStr
 * @returns
 */
export const koErrorFormat = (error: AxiosError<KoAxiosError, any> | AxiosResponse<KoAxiosError, any> | CombinedError, i18nlang?: i18n) => {
  let messages: string[] = [];
  if ((error as CombinedError)?.graphQLErrors?.length > 0) {
    // graphql异常
    const gqlErr = (error as CombinedError).graphQLErrors[0]
    const errorCode = gqlErr?.extensions?.code as KoErr['code'];
    const errorMeta = gqlErr?.extensions?.meta as KoErr['meta'];
    if (errorMeta || errorCode) {
      const kefStr = KoErrFormat({
        code: errorCode,
        message: errorCode ? undefined : gqlErr.message,
        meta: errorMeta,
      }, i18nlang)
      if (kefStr) {
        messages.push(kefStr)
      }
    }
    if (messages.length === 0) {
      const errStr = (error as CombinedError).toString().replace('[Network] ', '').replace('[GraphQL] ', '')
      if (i18nlang) {
        messages.push(i18nlang.t(errStr))
      } else {
        messages.push(errStr)
      }
    }
  } else {
    // Axios异常
    const response = (error as AxiosError<KoAxiosError, any>)?.response ?? (error as AxiosResponse<KoAxiosError, any>)
    if (response?.data?.errors?.length) {
      const errStr = KoErrFormat(response.data.errors[0], i18nlang)
      if (errStr) {
        messages.push(errStr)
      }
    }
    if (messages.length === 0 && response?.statusText) {
      if (i18nlang) {
        messages.push(i18nlang.t(response.statusText))
      } else {
        messages.push(response.statusText)
      }
    }
    if (messages.length === 0 && (error as AxiosError<KoAxiosError, any>).message) {
      if (i18nlang) {
        messages.push(i18nlang.t((error as AxiosError<KoAxiosError, any>).message))
      } else {
        messages.push((error as AxiosError<KoAxiosError, any>).message)
      }
    }
  }
  return messages.length > 0 ? messages.join(' ') : undefined;
};