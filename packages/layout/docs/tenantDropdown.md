---
sidebar_label: TenantDropdown
---

本 Demo 演示用法。

```tsx preview
import { TenantDropdown } from "@knockout-js/layout";
import { useState } from "react";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
import { adminxApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: 'default',
    url: adminxApi,
  }
])

export default () => {
  const [tenantId, setTenantId] = useState("1");
  const dataSource = [
    {id:1,name:'tenant-1'},
    {id:2,name:'tenant-2'},
  ]

  return (
    <div style={{width: "100px"}}>
      <TenantDropdown value={tenantId} dataSource={dataSource} onChange={setTenantId}/>
    </div>
  );
};
```

## props

| 属性       | 描述       | 类型                 | 必填 | 默认值 |
| ---------- | ---------- | -------------------- | ---- | ------ |
| value      | 值         | string               | ✅    | -      |
| dataSource | 提供数据源 | Org[]                | ✅    | -      |
| onChange   | 更新值     | (value:string)=>void | ✅    | -      |
