import {
  AnyVariables,
  cacheExchange,
  Client,
  DocumentInput,
  fetchExchange,
  OperationContext,
  OperationResult,
  OperationResultSource,
  createClient,
} from 'urql';
import { CustomClientOptions } from "./types";

const defaultClient = createClient({
  url: '/graphql/query',
  requestPolicy: 'cache-and-network',
  exchanges: [
    cacheExchange,
    fetchExchange,
  ],
})

export const urqlInstances: Record<string, {
  client: Client;
  config: CustomClientOptions;
}> = {};

/**
 * 根据配置处理实例的创建
 * @param config
 */
export function createUrqlInstance(config: CustomClientOptions) {
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
}

/**
 * 获取default client
 * @returns
 */
export function getDefaultClient() {
  return defaultClient;
}

/**
 * query请求
 * @param instanceName
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export async function queryRequest<Data = any, Variables extends AnyVariables = AnyVariables>(
  instanceName: string,
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext>
): Promise<OperationResultSource<OperationResult<Data, Variables>>> {

  const urqlInstance = urqlInstances[instanceName];

  return await urqlInstance.client.query(query, variables, {
    url: urqlInstance.config?.url,
    ...context
  }).toPromise();
}


/**
 * paging请求
 * @param instanceName
 * @param query
 * @param variables
 * @param current
 * @param context
 * @returns
 */
export async function pagingRequest<Data = any, Variables extends AnyVariables = AnyVariables>(
  instanceName: string,
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  current: number,
  context?: Partial<OperationContext>
): Promise<OperationResultSource<OperationResult<Data, Variables>>> {
  const urqlInstance = urqlInstances[instanceName];

  return await urqlInstance.client.query(query, variables, {
    url: `${urqlInstance.config?.url}?p=${current}`,
    ...context
  }).toPromise();
}

/**
 * mutation请求
 * @param instanceName
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export async function mutationRequest<Data = any, Variables extends AnyVariables = AnyVariables>(
  instanceName: string,
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext>
): Promise<OperationResultSource<OperationResult<Data, Variables>>> {
  const urqlInstance = urqlInstances[instanceName];

  return await urqlInstance.client.mutation(query, variables, {
    url: urqlInstance.config?.url,
    ...context
  }).toPromise();
}

/**
 * subscription请求
 * @param instanceName
 * @param query
 * @param variables
 * @param context
 * @returns
 */
export async function subscriptionRequest<Data = any, Variables extends AnyVariables = AnyVariables>(
  instanceName: string,
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext>
): Promise<OperationResultSource<OperationResult<Data, Variables>>> {
  const urqlInstance = urqlInstances[instanceName];

  return await urqlInstance.client.subscription(query, variables, {
    url: urqlInstance.config?.url,
    ...context
  }).toPromise();
}

