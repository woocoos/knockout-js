---
sidebar_label: OrgModal
---

本 Demo 演示用法

```tsx preview
import { OrgModal } from "@knockout-js/org";
import { useState } from "react";
import { Button } from "antd";
import { OrgKind } from "@knockout-js/api";
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
      <OrgModal
        open={open}
        title="组织列表"
        kind={OrgKind.Root}
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

| 属性            | 描述                                                          | 类型                  | 必填 | 默认值 |
|---------------|-------------------------------------------------------------|---------------------|----|-----|
| open          | 显示弹框                                                        | boolean             | ✅  | -   |
| orgId         | 根据orgId过滤pathHasPrefix                                      | string              | ❌  | -   |
| appId         | appId授权的组织列表                                                | string              | ❌  | -   |
| kind          | 类型                                                          | OrgKind             | ✅  | -   |
| title         | 弹框标题                                                        | string              | ❌  | -   |
| isMultiple    | 多选                                                          | boolean             | ❌  | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps          | ❌  | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps       | ❌  | -   |
| onClose       | 返回选中                                                        | (data?:Org[])=>void | ✅  | -   |
