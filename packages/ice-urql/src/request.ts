import { AnyVariables, Client, useQuery, UseQueryArgs, UseQueryResponse } from 'urql';
import { RequestConfig } from "./types";

const defaultClientOptions = {
  url: '/graphql/query',
  exchanges: [],
}

const urqlClient = {
  default: new Client(defaultClientOptions),
}

export type useClient = typeof useQuery;
export function useRequest<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(args: UseQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables> {
  return  useQuery(args);
}
