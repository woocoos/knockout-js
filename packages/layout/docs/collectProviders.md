---
sidebar_label: CollectProviders
---
本组件聚合了整套knockout-js框架的 react 的上下文

本 Demo 演示用法。

```tsx preview
import { CollectProviders,LocaleType } from "@knockout-js/layout";

export default () => {
  return (
      <CollectProviders
        appCode="test"
        tenantId="1"
        locale={LocaleType.zhCN}
        dark={false}
        pathname={location.pathname}
      >
        内容
      </CollectProviders>
  );
};
```

## props

<ReactDocgenProps path="../src/components/collect-providers/index.tsx"></ReactDocgenProps>
