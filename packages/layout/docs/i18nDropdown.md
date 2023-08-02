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

<ReactDocgenProps path="../src/components/i18n-dropdown/index.tsx"></ReactDocgenProps>
