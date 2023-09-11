---
sidebar_label: UserModal
---

本 Demo 演示用法

```tsx preview
import { UserModal } from "@knockout-js/org";
import { useState } from "react";
import { Button } from "antd";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
import { adminxApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: 'default',
    url: adminxApi,
  }
])

export default () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        按钮
      </Button>
      <UserModal
        open={open}
        title="用户列表"
        onClose={(data) => {
          console.log(data);
          setOpen(false);
        }}
      />
    </>
  );
};
```

## props

| 属性            | 描述                                                          | 类型                   | 必填 | 默认值 |
|---------------|-------------------------------------------------------------|----------------------|----|-----|
| open          | 显示弹框                                                        | boolean              | ✅  | -   |
| title         | 弹框标题                                                        | string               | ✅  | -   |
| orgId         | orgId下的用户                                                   | string               | ❌  | -   |
| orgRoleId     | orgRoleId下的用户                                               | string               | ❌  | -   |
| userType      | 类型过滤                                                        | UserUserType         | ❌  | -   |
| isMultiple    | 多选                                                          | boolean              | ❌  | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps           | ❌  | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps        | ❌  | -   |
| onClose       | 返回选中                                                        | (data?:User[])=>void | ✅  | -   |
