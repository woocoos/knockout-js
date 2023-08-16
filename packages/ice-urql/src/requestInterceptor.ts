import { Interceptors } from "@ice/plugin-request";
import { message } from "antd";
import type { AxiosError, AxiosResponse } from "axios";

interface ReqInterceptorOpts {
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
  error?: (error: AxiosError<unknown, any>) => void;
}

/**
 * defineRequestConfig 的默认配置 拦截器
 * @param option
 * @returns
 */
export const requestInterceptor = (option: ReqInterceptorOpts) => {
  const { store, login, loginRedirectKey, error } = option;
  const result: Interceptors = {
    request: {
      onConfig(config) {
        const { token, tenantId } = store.getState();
        if (config.headers) {
          if (!config.headers['Authorization']) {
            config.headers['Authorization'] = token ? `Bearer ${token}` : ''
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
        if (response.status === 200 && response.data.errors) {
          // 提取第一个异常来展示
          if (response.data.errors?.[0]?.message) {
            message.error(response.data.errors?.[0]?.message);
          }
        }
        return response;
      },
      onError: async (err) => {
        if (err.response?.status === 401) {
          if (login) {
            location.href = `${login}?${loginRedirectKey ?? 'redirect'}=${encodeURIComponent(location.href)}`
          }
        }

        const errRes = err.response as AxiosResponse<{
          errors: { message: string }[]
        }, any>
        let msg = errRes?.statusText;
        if (errRes?.data?.errors?.[0]?.message) {
          msg = errRes?.data?.errors?.[0]?.message;
        }

        if (msg) {
          message.error(msg);
        }

        error?.(err as AxiosError<unknown, any>)
      },
    },
  }

  return result;
}
