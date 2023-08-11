---
sidebar_label: 多语言
---

本 Demo 演示用法

```tsx preview
import { useState } from "react";
import { OrgSelect } from "@knockout-js/org";
import { BasicProvider, LocaleType } from "@knockout-js/layout";

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
        <BasicProvider locale={LocaleType.enUS}>
          <OrgSelect value={org} onChange={setOrg}/>
        </BasicProvider>
      </div>
    </>
  );
};
```

## Props

| 属性       | 描述     | 类型              | 必填 | 默认值 |
|----------|--------|-----------------|----|-----|
| locale   | 使用的多语言 | Locale          | ❌  | -   |
| children | 子节点    | React.ReactNode | ✅  | -   |

## hook

| 方法                              | 说明               | 结果                   |
|---------------------------------|------------------|----------------------|
| useLocale(componentName:string) | 根据组件名称获取对应的多语言数据 | Locale.componentName |
