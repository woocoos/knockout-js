---
sidebar_label: UserSelect
---

本 Demo 演示用法

```tsx preview
import { UserSelect, CClient } from "@knockout-js/org";
import { useState } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

export default () => {
  const [app, setApp] = useState(),
    url = "http://127.0.0.1:3001/mock-api-adminx/graphql/query";

  const client = new Client({
    url,
    exchanges: [cacheExchange, fetchExchange],
  }) as CClient;

  client.url = url;

  return (
    <Provider value={client}>
      <UserSelect value={app} onChange={setApp} />
    </Provider>
  );
};
```

## Props

| 属性          | 描述                                                          | 类型               | 必填 | 默认值 |
| ------------- | ------------------------------------------------------------- | ------------------ | ---- | ------ |
| value         | 值                                                            | App                | -    | -      |
| disabled      | 禁用                                                          | boolean            | -    | -      |
| orgId         | orgId的用户                                                   | string             | -    | -      |
| orgRoleId     | orgRoleId的用户                                               | string             | -    | -      |
| userType      | 过滤用户类型                                                  | UserUserType       | -    | -      |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps        | -    | -      |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps         | -    | -      |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps      | -    | -      |
| onChange      | value变更时回调                                               | (value?:App)=>void | -    | -      |
