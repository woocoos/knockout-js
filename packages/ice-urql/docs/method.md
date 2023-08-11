---
sidebar_label: 方法
---

# 方法

提供了各种urql调用方法可在页面中或者方法中使用

## useQuery

提供query的`hook`方法与urql使用一致，instanceName通过context传值

示例：

```tsx
import { useQuery } from "@knockout-js/ice-urql/runtime";

const TodosQuery = gql`
  query {
    todos {
      id
    }
  }
`;

const Todos = () => {
  const [result, reexecuteQuery] = useQuery({
    query: TodosQuery,
    context: {
      instanceName: 'ucenter'
    }
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return (
    <ul>
      {data.todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

## usePaging

提供query的`hook`方法与urql使用一致，instanceName通过context传值

示例：

```tsx
import { usePaging } from "@knockout-js/ice-urql/runtime";

const TodosQuery = gql`
  query {
    todos {
      id
    }
  }
`;

const Todos = () => {
  const [result, reexecuteQuery] = usePaging({
    query: TodosQuery,
    current: 1,
    context: {
      instanceName: 'ucenter'
    }
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return (
    <ul>
      {data.todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

## useMutation

提供mutation的`hook`方法与urql使用一致，instanceName通过context传值

示例：

```tsx
import { useMutation } from "@knockout-js/ice-urql/runtime";

const UpdateTodo = `
  mutation ($id: ID!, $title: String!) {
    updateTodo (id: $id, title: $title) {
      id
      title
    }
  }
`;

const Todo = () => {
  const [updateTodoResult, updateTodo] = useMutation(UpdateTodo);

  const submit = newTitle => {
    const variables = { id: 1, title: newTitle || '' };
    const context = { context: { instanceName: 'ucenter' } }
    updateTodo(variables,context).then(result => {
      // The result is almost identical to `updateTodoResult` with the exception
      // of `result.fetching` not being set.
      // It is an OperationResult.
    });
  };
};
```

## useSubscription

提供subscription的`hook`方法与urql使用一致，instanceName通过context传值

示例：

```tsx
import { useSubscription } from "@knockout-js/ice-urql/runtime";

const newMessages = `
  subscription MessageSub {
    newMessages {
      id
      from
      text
    }
  }
`;

const handleSubscription = (messages = [], response) => {
  return [response.newMessages, ...messages];
};

const Messages = () => {
  const [res] = useSubscription({ query: newMessages, context: { instanceName: 'ucenter'} }, handleSubscription);

  if (!res.data) {
    return <p>No new messages</p>;
  }

  return (
    <ul>
      {res.data.map(message => (
        <p key={message.id}>
          {message.from}: "{message.text}"
        </p>
      ))}
    </ul>
  );
};
```

## getInstance

根据instanceName获取urql的client和配置

instanceName不传入默认取default

```ts
import { getInstance } from "@knockout-js/ice-urql/request";

getInstance("ucenter");
```

## query

执行query时使用,与 urql的client.query一致

instanceName不传入默认取default

```ts
import { query } from "@knockout-js/ice-urql/request";

query('', {}, { instanceName: 'ucenter'} );
```

## paging

执行分页时使用 特殊处理了p的传入是knockout后端封装分页接口的相关处理调用

instanceName不传入默认取default

```ts
import { paging } from "@knockout-js/ice-urql/request";

paging('', {}, 1,{ instanceName: 'ucenter'} );

```

## mutation

执行mutation时使用

instanceName不传入默认取default

```ts
import { mutation } from "@knockout-js/ice-urql/request";

mutation('', {}, { instanceName: 'ucenter'} );
```

## subscription

执行subscription时使用

instanceName不传入默认取default

```ts
import { subscription } from "@knockout-js/ice-urql/request";

subscription('', {}, { instanceName: 'ucenter'} );
```
