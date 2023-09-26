import { Exchange, MapExchangeOpts, RequestPolicy } from 'urql';
import { AuthExchangeOpts, SubExchangeOpts } from './exchange';

export * from './requestInterceptor.js'

export interface CustomClientOptions {
  /**
   * 请求url
   */
  url: string;
  /**
   * 实例key
   */
  instanceName: string;
  /**
   * 请求策略
   */
  requestPolicy?: RequestPolicy;
  /**
   * 自定义exchanges
   */
  exchanges?: Exchange[];
  /**
   * default exchanges 添加 AuthHandler 或 MapExchangeOpts的配置来启用
   */
  exchangeOpt?: {
    authOpts?: AuthExchangeOpts,
    mapOpts?: MapExchangeOpts,
    subOpts?: SubExchangeOpts,
  }
}

export type RequestConfig = CustomClientOptions | CustomClientOptions[];

/**
 * 定义配置
 * @param configOrDefineConfig
 * @returns
 */
export function defineUrqlConfig(configOrDefineConfig: RequestConfig | ((data?: any) => Promise<RequestConfig>)) {
  return configOrDefineConfig;
}


