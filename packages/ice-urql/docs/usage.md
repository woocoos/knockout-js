---
sidebar_label: 使用
sidebar_position: 0

---

# 使用


## 引入插件
```ts title=ice.config.mts
import { defineConfig } from '@ice/app';
import urqlPlugin from '@knockout-js/ice-urql';

export default defineConfig(() => ({
  plugins: [
    urqlPlugin(),
  ],
}));

```


## 初始化配置

[详见](./config)

```ts title=app.tsx
import { defineUrqlConfig } from "@knockout-js/ice-urql/esm/types";

export const urqlConfig = defineUrqlConfig(() => [
 
])
```
