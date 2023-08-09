---
sidebar_label: TenantDropdown
---

本 Demo 演示用法。

```tsx preview
import { TenantDropdown } from "@knockout-js/layout";
import { useState } from "react";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

export default () => {
  const [tenantId, setTenantId] = useState("1");

  return (
    <div style={{ width: "100px" }}>      
      <TenantDropdown value={tenantId} onChange={setTenantId} />
    </div>
  );
};
```

## props

| 属性     | 描述   | 类型                 | 必填 | 默认值 |
| -------- | ------ | -------------------- | ---- | ------ |
| value    | 值     | string               | ✅   | -      |
| onChange | 更新值 | (value:string)=>void | ✅   | -      |
