import { Interceptors } from "@ice/plugin-request";
import type { AxiosError, AxiosResponse } from "axios";
import { RequestHeaderAuthorizationMode, getRequestHeaderAuthorization, goLogin } from "./request.js";

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
  const { store, login, loginRedirectKey, error, headerMode } = option;
  const result: Interceptors = {
    request: {
      onConfig(config) {
        const { token, tenantId } = store.getState();
        if (config.headers) {
          if (!config.headers['Authorization']) {
            config.headers['Authorization'] = token ? getRequestHeaderAuthorization(token, headerMode) : ''
          }
          if (!config.headers['X-Tenant-ID']) {
            config.headers['X-Tenant-ID'] = tenantId
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
