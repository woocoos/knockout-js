---
sidebar_label: I18nDropdown
---

本 Demo 演示用法。

```tsx preview
import { I18nDropdown } from "@knockout-js/layout";
import { useState } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

export default () => {
  const [locale, setLocale] = useState("zh-cn"),
    menuItems = [
      { key: "zh-cn", label: "中文" },
      { key: "en-us", label: "En" },
    ];

  return (
    <I18nDropdown value={locale} menuItems={menuItems} onChange={setLocale} />
  );
};
```

## props

| 参数      | 说明     | 类型                        | 默认值 |
| --------- | -------- | --------------------------- | ------ |
| value     | 值       | T                           | -      |
| menuItems | 下拉列表 | { key: T, label: string }[] | -      |
| onChange  | 更新值   | (value:T)=>void             | -      |
