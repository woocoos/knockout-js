import {
  AnyVariables,
  cacheExchange,
  Client,
  DocumentInput,
  fetchExchange,
  OperationContext,
  OperationResult,
  OperationResultSource,
  UseQueryArgs,
  useQuery as useUrqlQuery,
  useMutation as useUrqlMutation,
  useSubscription as useUrqlSubscription,
  UseSubscriptionArgs,
  SubscriptionHandler,
  createClient,
} from 'urql';
import { CustomClientOptions } from "./types";

export const urqlInstances: Record<string, {
  client: Client;
  config: CustomClientOptions[];
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
      config: [config],
    }
  } else {
    if (!urqlInstances['default']) {
      urqlInstances['default'] = {
        client: createClient({
          url: '/graphql/query',
          requestPolicy: 'cache-and-network',
          exchanges: [
            cacheExchange,
            fetchExchange,
          ],
        }),
        config: [],
      }
    }
    urqlInstances['default'].config.push(config)
  }
}

function getInstanceNameInstances(instanceName: string) {
  const urqlInstance = urqlInstances[instanceName] || urqlInstances['default'];
  return {
    client: urqlInstance.client,
    config: urqlInstance.config.find(item => item.instanceName === instanceName)
  };
}

/**
 * hook query
 * @param args
 * @returns
 */
export function useQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: UseQueryArgs<Variables, Data>
) {
  return useUrqlQuery(args);
}

/**
 * hook mutation
 * @param args
 * @returns
 */
export function useMutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: DocumentInput<Data, Variables>
) {
  return useUrqlMutation(args);
}

/**
 * hook subscription
 * @param args
 * @param handler
 * @returns
 */
export function useSubscription<Data = any, Result = Data, Variables extends AnyVariables = AnyVariables>(
  instanceName: string,
  args: UseSubscriptionArgs<Variables, Data>,
  handler?: SubscriptionHandler<Data, Result>
) {
  const urqlInstance = getInstanceNameInstances(instanceName);
  args.context = { url: urqlInstance.config?.url, ...args.context }
  return useUrqlSubscription(args, handler);
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

  const urqlInstance = getInstanceNameInstances(instanceName)

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
  const urqlInstance = getInstanceNameInstances(instanceName)

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
  const urqlInstance = getInstanceNameInstances(instanceName)

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
  const urqlInstance = getInstanceNameInstances(instanceName)

  return await urqlInstance.client.subscription(query, variables, {
    url: urqlInstance.config?.url,
    ...context
  }).toPromise();
}

