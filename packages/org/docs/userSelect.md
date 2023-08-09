---
sidebar_label: UserSelect
---

本 Demo 演示用法

```tsx preview
import { UserSelect } from "@knockout-js/org";
import { useState } from "react";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

export default () => {
  const [app, setApp] = useState();
  return (
    <UserSelect value={app} onChange={setApp} />
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
