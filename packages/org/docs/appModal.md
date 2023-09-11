---
sidebar_label: AppModal
---

本 Demo 演示用法

```tsx preview
import { AppModal } from "@knockout-js/org";
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
      <AppModal
          open={open}
          title="选择应用"
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
| orgId         | orgId授权的应用                                                  | string              | ❌  | -   |
| title         | 弹框标题                                                        | string              | ❌  | -   |
| isMultiple    | 多选                                                          | boolean             | ❌  | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps          | ❌  | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps       | ❌  | -   |
| onClose       | 返回选中                                                        | (data?:App[])=>void | ✅  | -   |
