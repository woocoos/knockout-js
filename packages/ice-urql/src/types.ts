import { ClientOptions } from 'urql';
import { AuthHandler } from "./request";

export interface CustomClientOptions extends ClientOptions {
  instanceName?: string;
  withFullResponse?: boolean;

  authHandler?: AuthHandler;
}

export type RequestConfig = CustomClientOptions | CustomClientOptions[];

export function defineUrqlConfig(configOrDefineConfig: RequestConfig | (() => RequestConfig)): RequestConfig {
  if (typeof configOrDefineConfig === 'function') {
    return configOrDefineConfig();
  }
  return configOrDefineConfig;
}
