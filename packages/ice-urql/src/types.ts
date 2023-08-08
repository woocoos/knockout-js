import { Exchange, MapExchangeOpts } from 'urql';
import { AuthExchangeOpts } from './exchange';

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
   * 自定义exchanges
   */
  exchanges?: Exchange[];
  /**
   * default exchanges 添加 AuthHandler 或 MapExchangeOpts的配置来启用
   */
  exchangeOpt?: {
    authOpts?: AuthExchangeOpts,
    mapOpts?: MapExchangeOpts,
  }
}

export type RequestConfig = CustomClientOptions | CustomClientOptions[];

export function defineUrqlConfig(configOrDefineConfig: RequestConfig | (() => RequestConfig)): RequestConfig {
  if (typeof configOrDefineConfig === 'function') {
    return configOrDefineConfig();
  }
  return configOrDefineConfig;
}
