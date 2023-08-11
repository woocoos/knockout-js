import type { RuntimePlugin } from '@ice/runtime/types';
import React, { useEffect, useMemo } from 'react';
import { RequestConfig } from "./types";
import { createUrqlInstance, getInstance } from "./request.js";
import {
  AnyVariables,
  DocumentInput,
  Provider,
  RequestPolicy,
  OperationResult,
  OperationContext,
  GraphQLRequestParams,
  SubscriptionHandler,
  useQuery as useUrqlQuery,
  useMutation as useUrqlMutation,
  useSubscription as useUrqlSubscription
} from 'urql';

const EXPORT_NAME = 'urqlConfig';

const runtime: RuntimePlugin = async ({ appContext, addProvider }) => {
  const { appExport, appData } = appContext;
  const exported = appExport?.[EXPORT_NAME];
  const requestConfig: RequestConfig = (typeof exported === 'function' ? await exported(appData) : exported) || {};

  createUrqlInstance(requestConfig);

  addProvider(({ children }) => (
    <Provider value={getInstance().client}>{children}</Provider>
  ))
};

type UseQueryArgs<Variables extends AnyVariables = AnyVariables, Data = any> = {
  requestPolicy?: RequestPolicy;
  context?: Partial<OperationContext> & { instanceName?: string };
  pause?: boolean;
} & GraphQLRequestParams<Data, Variables>;

type UseSubscriptionArgs<Variables extends AnyVariables = AnyVariables, Data = any> = {
  pause?: boolean;
  context?: Partial<OperationContext> & { instanceName?: string };
} & GraphQLRequestParams<Data, Variables>;

/**
 * hook query
 * @param args
 * @returns
 */
export function useQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: UseQueryArgs<Variables, Data>
) {
  const instanceName = args.context?.instanceName;
  const urqlInstance = getInstance(instanceName);
  args.context = { url: urqlInstance.config.url, ...args.context }
  return useUrqlQuery({ ...args, context: useMemo(() => (args.context), []) });
}

/**
 * hook paging
 * @param args
 * @param current
 * @returns
 */
export function usePaging<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: UseQueryArgs<Variables, Data>,
  current: number,
) {
  const instanceName = args.context?.instanceName;
  const urqlInstance = getInstance(instanceName);
  args.context = { url: `${urqlInstance.config.url}?p=${current}`, ...args.context }
  return useUrqlQuery({ ...args, context: useMemo(() => (args.context), []) });
}

/**
 * hook mutation
 * @param query
 * @returns [result, executeInstance]
 */
export function useMutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
) {
  const [result, execute] = useUrqlMutation(query);
  const executeInstance = (variables: Variables, context?: Partial<OperationContext> & { instanceName?: string }): Promise<OperationResult<Data, Variables>> => {
    const instanceName = context?.instanceName;
    const urqlInstance = getInstance(instanceName);
    context = { url: urqlInstance.config.url, ...context }
    return execute(variables, context)
  }
  return [result, executeInstance];
}

/**
 * hook subscription
 * @param args
 * @param handler
 * @returns
 */
export function useSubscription<Data = any, Result = Data, Variables extends AnyVariables = AnyVariables>(
  args: UseSubscriptionArgs<Variables, Data>,
  handler?: SubscriptionHandler<Data, Result>,
) {
  const instanceName = args.context?.instanceName;
  const urqlInstance = getInstance(instanceName);
  args.context = { url: urqlInstance.config.url, ...args.context }
  return useUrqlSubscription({ ...args, context: useMemo(() => (args.context), []) }, handler);
}

export default runtime;
