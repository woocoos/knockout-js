---
sidebar_label: I18nDropdown
---

本 Demo 演示用法。

```tsx preview
import { I18nDropdown, Provider, LocaleType } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  const [locale, setLocale] = useState(LocaleType.zhCN);

  return (
    <Provider locale={locale}>
      <I18nDropdown onChange={setLocale}/>
    </Provider>
  );
};
```

## props

<!-- <ReactDocgenProps path="../src/components/i18n-dropdown/index.tsx"></ReactDocgenProps> -->

| 属性     | 描述                                    | 类型     | 必填 | 默认值 |
| -------- | --------------------------------------- | -------- | ---- | ------ |
| onChange | 值变更事件 (value: LocaleType) => void; | Function | ❌    | -      |
