---
sidebar_label: AppModal
---

本 Demo 演示用法

```tsx preview
import { AppModal, CClient } from "@knockout-js/org";
import { useState } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { Button } from "antd";

export default () => {
  const [open, setOpen] = useState(false),
    url = "http://127.0.0.1:3001/mock-api-adminx/graphql/query";

  const client = new Client({
    url,
    exchanges: [cacheExchange, fetchExchange],
  }) as CClient;

  client.url = url;

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        按钮
      </Button>
      <Provider value={client}>
        <AppModal
          open={open}
          onClose={(data) => {
            console.log(data);
            setOpen(false);
          }}
        />
      </Provider>
    </>
  );
};
```

## props

| 参数            | 说明                                                          | 类型                  | 默认值 |
|---------------|-------------------------------------------------------------|---------------------|-----|
| open          | 显示弹框                                                        | boolean             | -   |
| orgId         | orgId授权的应用                                                  | string              | -   |
| title         | 弹框标题                                                        | string              | -   |
| isMultiple    | 多选                                                          | boolean             | -   |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps          | -   |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps       | -   |
| onClose       | 返回选中                                                        | (data?:App[])=>void | -   |
