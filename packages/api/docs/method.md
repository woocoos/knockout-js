# 方法

提供了一些工具类方法

## gid

get global id by type and id, it is used for relay node query.

### 参数
```ts
const gid: (type: string, id: string | number) => string
```

### 用例

```tsx preview
import { gid } from "@knockout-js/api";

export default () => {

  return (
    <div>
      使用gid后的结果：{gid('Org',2)}
    </div>
  );
};
```

## parseGid

parse gid from base64 string to utf8 string

### 参数

```ts
const parseGid: (gid: string) => string
```

### 用例
```tsx preview
import { parseGid } from "@knockout-js/api";

export default () => {

  return (
    <div>
      使用parseGid后的结果：{parseGid('b3JnOjI=')}
    </div>
  );
};
```
