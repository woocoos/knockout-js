---
sidebar_label: 多语言
---

本 Demo 演示一行文字的用法。

```tsx preview
import { useState } from "react";
import { OrgInput, LocaleProvider, CClient } from "@knockout-js/org";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import enUS from "@knockout-js/org/src/components/locale/en_US";

export default () => {
  const [org, setOrg] = useState(),
    url = "http://127.0.0.1:3001/mock-api-adminx/graphql/query";

  const client = new Client({
    url,
    exchanges: [cacheExchange, fetchExchange],
  }) as CClient;

  client.url = url;

  return (
    <Provider value={client}>
      <div>
        中文
        <OrgInput value={org} onChange={setOrg} />
      </div>
      <div>
        英文
        <LocaleProvider locale={enUS}>
          <OrgInput value={org} onChange={setOrg} />
        </LocaleProvider>
      </div>
    </Provider>
  );
};
```

## Props

| 参数     | 说明         | 类型            | 默认值 |
| -------- | ------------ | --------------- | ------ |
| locale   | 使用的多语言 | Locale          | -      |
| children | 子节点       | React.ReactNode | -      |

## hook

| 方法                            | 说明                             | 结果                 |
| ------------------------------- | -------------------------------- | -------------------- |
| useLocale(componentName:string) | 根据组件名称获取对应的多语言数据 | Locale.componentName |
