import type { RuntimePlugin } from '@ice/runtime/types';
import React from 'react';
import { RequestConfig } from "./types";
import { createUrqlInstance, getDefaultClient } from "./request.js";
import {
  AnyVariables,
  DocumentInput,
  Provider,
  UseQueryArgs,
  UseSubscriptionArgs,
  SubscriptionHandler,
  useQuery as useUrqlQuery,
  useMutation as useUrqlMutation,
  useSubscription as useUrqlSubscription
} from 'urql';

const EXPORT_NAME = 'urqlConfig';

const runtime: RuntimePlugin = async ({ appContext, addProvider }) => {
  const { appExport } = appContext;
  const exported = appExport?.[EXPORT_NAME];
  const requestConfig: RequestConfig = (typeof exported === 'function' ? exported() : exported) || {};

  if (Array.isArray(requestConfig)) {
    requestConfig.forEach((config) => {
      createUrqlInstance(config);
    });
  } else {
    createUrqlInstance(requestConfig);
  }

  addProvider(({ children }) => (
    <Provider value={getDefaultClient()}>{children}</Provider>
  ))
};


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
  args: UseSubscriptionArgs<Variables, Data>,
  handler?: SubscriptionHandler<Data, Result>
) {
  return useUrqlSubscription(args, handler);
}

export default runtime;
