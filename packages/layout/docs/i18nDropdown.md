---
sidebar_label: I18nDropdown
---

本 Demo 演示用法。

```tsx preview
import { I18nDropdown, BasicProvider, LocaleType } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  const [locale, setLocale] = useState(LocaleType.zhCN);

  return (
    <BasicProvider locale={locale}>
      <I18nDropdown onChange={setLocale} />
    </BasicProvider>
  );
};
```

## props

<!-- <ReactDocgenProps path="../src/components/i18n-dropdown/index.tsx"></ReactDocgenProps> -->

| 属性     | 描述                                    | 类型     | 必填 | 默认值 |
| -------- | --------------------------------------- | -------- | ---- | ------ |
| onChange | 值变更事件 (value: LocaleType) => void; | Function | ❌   | -      |
