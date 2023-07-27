---
sidebar_label: OrgInput
---

本 Demo 演示用法

```tsx preview
import { OrgSelect, CClient } from "@knockout-js/org";
import { useState } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { OrgKind } from "@knockout-js/api";

export default () => {
  const [org, setOrg] = useState(),
    url = "http://127.0.0.1:3001/mock-api-adminx/graphql/query";

  const client = new Client({
    url,
    exchanges: [cacheExchange, fetchExchange],
  }) as CClient;

  client.url = url;

  return (
    <Provider value={client}>
      <OrgSelect value={org} onChange={setOrg} kind={OrgKind.Root} />
    </Provider>
  );
};
```

## props

| 参数          | 说明                                                          | 类型               | 默认值 |
| ------------- | ------------------------------------------------------------- | ------------------ | ------ |
| value         | 值                                                            | Org                | -      |
| disabled      | 禁用                                                          | boolean            | -      |
| orgId         | 根据orgId过滤pathHasPrefix                                    | string             | -      |
| appId         | appId授权的组织列表                                           | string             | -      |
| kind          | 必填此类型                                                    | OrgKind            | -      |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps        | -      |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps         | -      |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps      | -      |
| onChange      | value变更时回调                                               | (value?:Org)=>void | -      |
