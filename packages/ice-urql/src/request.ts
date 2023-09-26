import {
  AnyVariables,
  cacheExchange,
  Client,
  DocumentInput,
  fetchExchange,
  OperationContext,
  OperationResult,
  createClient,
  ClientOptions,
  mapExchange,
  gql as urqlGql,
  OperationResultSource,
} from 'urql';
import { CustomClientOptions, RequestConfig } from "./types";
import { authExchange, subExchange } from './exchange.js';
import CryptoJS from 'crypto-js';

export const gql = urqlGql;

export const urqlInstances: Record<string, {
  client: Client;
  config: CustomClientOptions;
}> = {};

/**
 * 创建default client
 * @param config
 * @returns
 */
function createDefaultClient(config: CustomClientOptions) {
  const defaultOpt: ClientOptions = {
    url: config.url,
    requestPolicy: config.requestPolicy ?? 'cache-and-network',
    exchanges: [],
  }
  if (config.exchanges) {
    defaultOpt.exchanges = config.exchanges;
  } else {
    defaultOpt.exchanges.push(cacheExchange)

    if (config.exchangeOpt) {
      if (config.exchangeOpt.authOpts) {
        defaultOpt.exchanges.push(authExchange(config.exchangeOpt.authOpts))
      }
      if (config.exchangeOpt.mapOpts) {
        defaultOpt.exchanges.push(mapExchange(config.exchangeOpt.mapOpts))
      }
      if (config.exchangeOpt.subOpts) {
        defaultOpt.exchanges.push(subExchange(config.exchangeOpt.subOpts))
      }
    }
    defaultOpt.exchanges.push(fetchExchange)
  }
  return createClient(defaultOpt)
}

/**
 * 根据配置处理实例的创建
 * @param reqConf
 */
export function createUrqlInstance(reqConf: RequestConfig) {

  if (Array.isArray(reqConf)) {
    const defaultConfig = reqConf.find(config => config.instanceName === 'default');
    if (!defaultConfig) {
      throw Error('defineUrqlConfig: instanceName must set a "default"');
    }

    const defaultClient = createDefaultClient(defaultConfig)

    reqConf.forEach((config) => {
      if (config.exchanges) {
        urqlInstances[config.instanceName] = {
          client: createClient({
            url: config.url,
            requestPolicy: 'cache-and-network',
            exchanges: config.exchanges,
          }),
          config,
        }
      } else {
        urqlInstances[config.instanceName] = {
          client: defaultClient,
          config,
        }
      }
    });
  } else {
    if (reqConf.exchanges) {
      urqlInstances['default'] = {
        client: createClient({
          url: reqConf.url,
          requestPolicy: 'cache-and-network',
          exchanges: reqConf.exchanges,
        }),
        config: reqConf,
      }
    } else {
      urqlInstances['default'] = {
        client: createDefaultClient(reqConf),
        config: reqConf,
      }
    }
  }
}

/**
 * 获取client
 * @returns
 */
export function getInstance(instanceName?: string) {
  let ins = urqlInstances[instanceName ?? 'default']
  if (!ins) {
    ins = urqlInstances['default']
  }
  return ins;
}

/**
 * query请求
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export async function query<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string,
  }
) {

  const urqlInstance = getInstance(context?.instanceName);

  return await urqlInstance.client.query(query, variables, {
    url: urqlInstance.config?.url,
    ...context
  }).toPromise();
}

/**
 * paging请求
 * @param query
 * @param variables
 * @param current
 * @param context
 * @returns
 */
export async function paging<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  current: number,
  context?: Partial<OperationContext> & {
    instanceName?: string
  }
) {
  const urqlInstance = getInstance(context?.instanceName);

  return await urqlInstance.client.query(query, variables, {
    url: `${urqlInstance.config.url}?p=${current}`,
    ...context
  }).toPromise();
}

/**
 * mutation请求
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export async function mutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string
  },
) {
  const urqlInstance = getInstance(context?.instanceName);

  return await urqlInstance.client.mutation(query, variables, {
    url: urqlInstance.config.url,
    ...context
  }).toPromise();
}

/**
 * subscription请求
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export function subscription<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string
  },
) {
  const urqlInstance = getInstance(context?.instanceName);

  return urqlInstance.client.subscription(query, variables, {
    url: urqlInstance.config.url,
    ...context
  })
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
