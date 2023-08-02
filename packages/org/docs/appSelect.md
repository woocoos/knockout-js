---
sidebar_label: AppSelect
---

本 Demo 演示用法

```tsx preview
import { AppSelect, CClient } from "@knockout-js/org";
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
      <AppSelect value={app} onChange={setApp} />
    </Provider>
  );
};
```

## Props

| 参数            | 说明                                                          | 类型                 | 默认值 |
|---------------|-------------------------------------------------------------|--------------------|-----|
| value         | 值                                                           | App                | -   |
| disabled      | 禁用                                                          | boolean            | -   |
| orgId         | orgId授权的应用                                                  | string             | -   |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps        | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps         | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps      | -   |
| onChange      | value变更时回调                                                  | (value?:App)=>void | -   |
