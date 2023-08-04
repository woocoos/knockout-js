import { Exchange } from 'urql';

export interface CustomClientOptions {
  url: string;
  instanceName: string;
  exchanges?: Exchange[];
}

export type RequestConfig = CustomClientOptions | CustomClientOptions[];

export function defineUrqlConfig(configOrDefineConfig: RequestConfig | (() => RequestConfig)): RequestConfig {
  if (typeof configOrDefineConfig === 'function') {
    return configOrDefineConfig();
  }
  return configOrDefineConfig;
}
