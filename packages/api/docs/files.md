---
sidebar_position: 1
---

# file 接口

## 启用

```tsx title=app.ts
import { setFilesApi } from "@knockout-js/api";

// 配置好文件处理对应的api地址;
setFilesApi("http://xxxxxxx")
```

## Files 对象

```ts 
type Files = {
  id: string;
  name: string;
  size: number;
  path: string;
  createdAt: string;
  fileSource: {
    id: number;
    kind: "local";
    endpoint: string;
    bucket: string;
    region: string;
  };
}

```

## api


### setFilesApi

设置api地址支持

```tsx
import { setFilesApi } from "@knockout-js/api";

// 配置好文件处理对应的api地址
setFilesApi("")
```

### updateFiles

上传,成功后返回id

```tsx
import { updateFiles } from "@knockout-js/api";

const id = updateFiles({
  key:string;
  bucket:string;
  file:File;
})
```

### getFiles

根据ID获取[Files对象](#files-对象)

```tsx
import { getFiles } from "@knockout-js/api";

const data = getFiles("id")
```

### delFiles

根据ID删除[Files对象](#files-对象)

```tsx
import { delFiles } from "@knockout-js/api";

// 无异常为成功
delFiles("id")
```

### getFilesRaw

根据ID获取url值或者Blob对象

参数：type可为url或者不填

```tsx
import { getFilesRaw } from "@knockout-js/api";

getFilesRaw("id",type)
```
