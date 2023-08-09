---
sidebar_label: 方法
---

# 方法

提供了各种urql调用方法可在页面中或者方法中使用

## useQuery

提供query的`hook`方法与urql使用一致

```ts
import { useQuery } from "@knockout-js/ice-urql/runtime";

function useQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: UseQueryArgs<Variables, Data>,
  instanceName?: string,
): UseQueryResponse<Data, Variables>;
```

## usePaging

提供query的`hook`方法与urql使用一致

```ts
import { usePaging } from "@knockout-js/ice-urql/runtime";

function usePaging<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: UseQueryArgs<Variables, Data>,
  current: number,
  instanceName?: string,
): UseQueryResponse<Data, Variables>;
```

## useMutation

提供mutation的`hook`方法与urql使用一致

```ts
import { useMutation } from "@knockout-js/ice-urql/runtime";

function useMutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  args: DocumentInput<Data, Variables>,
): UseMutationResponse<Data, Variables>;
```

## useSubscription

提供subscription的`hook`方法与urql使用一致

```ts
import { useSubscription } from "@knockout-js/ice-urql/runtime";

function useSubscription<
  Data = any,
  Result = Data,
  Variables extends AnyVariables = AnyVariables,
>(
  args: UseSubscriptionArgs<Variables, Data>,
  handler?: SubscriptionHandler<Data, Result>,
): UseSubscriptionResponse<Result, Variables>;
```

## getInstance

根据instanceName获取urql的client和配置

instanceName不传入默认取default

```ts
import { getInstance } from "@knockout-js/ice-urql/request";

function getInstance(instanceName?: string): {
  client: Client;
  config: CustomClientOptions;
};
```

## query

执行query时使用

instanceName不传入默认取default

```ts
import { query } from "@knockout-js/ice-urql/request";

function query<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string;
  },
): Promise<OperationResult<Data, Variables>>;
```

## paging

执行分页时使用 特殊处理了p的传入是knockout后端封装分页接口的相关处理调用

instanceName不传入默认取default

```ts
import { paging } from "@knockout-js/ice-urql/request";

function paging<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  current: number,
  context?: Partial<OperationContext> & {
    instanceName?: string;
  },
): Promise<OperationResult<Data, Variables>>;
```

## mutation

执行mutation时使用

instanceName不传入默认取default

```ts
import { mutation } from "@knockout-js/ice-urql/request";

function mutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string;
  },
): Promise<OperationResult<Data, Variables>>;
```

## subscription

执行subscription时使用

instanceName不传入默认取default

```ts
import { subscription } from "@knockout-js/ice-urql/request";

function subscription<
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  query: DocumentInput<Data, Variables>,
  variables: Variables,
  context?: Partial<OperationContext> & {
    instanceName?: string;
  },
): Promise<OperationResult<Data, Variables>>;
```
