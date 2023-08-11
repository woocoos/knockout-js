---
sidebar_label: OrgSelect
---

本 Demo 演示用法

```tsx preview
import { OrgSelect } from "@knockout-js/org";
import { useState } from "react";
import { OrgKind } from "@knockout-js/api";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';

createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

export default () => {
  const [org, setOrg] = useState();
  return (
    <OrgSelect value={org} onChange={setOrg} kind={OrgKind.Root}/>
  );
};
```

## props

| 属性            | 描述                                                          | 类型                 | 必填 | 默认值 |
|---------------|-------------------------------------------------------------|--------------------|----|-----|
| value         | 值                                                           | Org                | ❌  | -   |
| disabled      | 禁用                                                          | boolean            | ❌  | -   |
| orgId         | 根据orgId过滤pathHasPrefix                                      | string             | ❌  | -   |
| appId         | appId授权的组织列表                                                | string             | ❌  | -   |
| kind          | 类型                                                          | OrgKind            | ✅  | -   |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps        | ❌  | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps         | ❌  | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps      | ❌  | -   |
| onChange      | value变更时回调                                                  | (value?:Org)=>void | ❌  | -   |
