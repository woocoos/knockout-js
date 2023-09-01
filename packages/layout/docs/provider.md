---
sidebar_label: Provider
---

本 Demo 演示用法

```tsx preview
import { useState } from "react";
import { OrgSelect } from "@knockout-js/org";
import { Provider, LocaleType } from "@knockout-js/layout";

export default () => {
  const [org, setOrg] = useState();
  return (
    <>
      <div>
        中文
        <OrgSelect value={org} onChange={setOrg}/>
      </div>
      <div>
        英文
        <Provider locale={LocaleType.enUS}>
          <OrgSelect value={org} onChange={setOrg}/>
        </Provider>
      </div>
    </>
  );
};
```

## Props

| 属性     | 描述         | 类型            | 必填 | 默认值          |
| -------- | ------------ | --------------- | ---- | --------------- |
| locale   | 使用的多语言 | Locale          | ❌    | LocaleType.zhCN |
| appCode  | 应用code     | string          | ❌    | -               |
| tenantId | tenantId     | string          | ❌    | -               |
| children | 子节点       | React.ReactNode | ✅    | -               |

## hook

| 方法          | 说明                 | 结果                      |
| ------------- | -------------------- | ------------------------- |
| useAppCode()  | 获取上下文的appCode  | strign  &#124;  undefined |
| useTenantId() | 获取上下文的tenantId | strign  &#124;  undefined |
