---
sidebar_label: TenantDropdown
---

本 Demo 演示用法。

```tsx preview
import { TenantDropdown } from "@knockout-js/layout";
import { useState } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

export default () => {
  const [tenantId, setTenantId] = useState("1");
  const client = new Client({
    url: "http://127.0.0.1:3001/mock-api-adminx/graphql/query",
    exchanges: [cacheExchange, fetchExchange],
  });

  return (
    <div style={{ width: "100px" }}>
      <Provider value={client}>
        <TenantDropdown value={tenantId} onChange={setTenantId} />
      </Provider>
    </div>
  );
};
```

## props

| 参数     | 说明   | 类型                 | 默认值 |
| -------- | ------ | -------------------- | ------ |
| value    | 值     | string               | -      |
| onChange | 更新值 | (value:string)=>void | -      |
