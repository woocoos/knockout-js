import { ClientOptions } from 'urql';

interface CustomRequest extends ClientOptions {
  instanceName?: string;
  withFullResponse?: boolean;
}

export type Request = CustomRequest | CustomRequest[];
export type RequestConfig = Request | object;

export function defineUrqlConfig(configOrDefineConfig: RequestConfig | (() => RequestConfig)): RequestConfig {
  if (typeof configOrDefineConfig === 'function') {
    return configOrDefineConfig();
  }
  return configOrDefineConfig;
}
