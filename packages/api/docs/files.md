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

```ts
function setFilesApi(prefix: string): void
```

### updateFiles

上传,成功后返回id

```tsx
function updateFiles(data: {
    key: string;
    bucket: string;
    file: File;
}): Promise<string | null>
```

### getFiles

根据ID获取[Files对象](#files-对象)

```tsx
function getFiles(fileId: string | number): Promise<Files | null>
```

### delFiles

根据ID删除[Files对象](#files-对象)

```tsx
function delFiles(fileId: string | number): Promise<any>
```

### getFilesRaw

根据ID获取url值或者Blob对象

参数：type可为url或者不填

```tsx
function getFilesRaw(fileId: string | number, type?: 'url'): Promise<string | Blob | null>
```
