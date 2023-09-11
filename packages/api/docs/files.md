# file 接口

## 启用

```tsx title=app.ts
import { files } from "@knockout-js/api";

// 配置好文件处理对应的api地址;
files.setFilesApi("http://xxxxxxx")
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

现提供的所有api,目前所有api都放于`@knockout-js/api`的 `files` 内, `@knockout-js/layout`中也会提供相关的上传组件功能提供给ui使用

### setFilesApi

设置api地址支持

```tsx
import { files } from "@knockout-js/api";

// 配置好文件处理对应的api地址
files.setFilesApi("")
```

### updateFiles

上传,成功后返回id

```tsx
import { files } from "@knockout-js/api";

const id = files.updateFiles({
  key:string;
  bucket:string;
  file:File;
})
```

### getFiles

根据ID获取[Files对象](#files-对象)

```tsx
import { files } from "@knockout-js/api";

const data = files.getFiles("id")
```

### delFiles

根据ID删除[Files对象](#files-对象)

```tsx
import { files } from "@knockout-js/api";

// 无异常为成功
files.delFiles("id")
```

### getFilesRaw

根据ID获取url值或者Blob对象

参数：type可为url或者不填

```tsx
import { files } from "@knockout-js/api";

files.getFilesRaw("id",type)
```
