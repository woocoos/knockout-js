---
sidebar_position: 1
---

# aws-s3 接口

## 使用

```ts title=xxx.ts
import { getFileUrl } from "@knockout-js/api";

export default () => {
    const url = await getFileUrl(path)
}

```

## api

api中的 `endpoint` `bucket` 两个非必填参数都是默取fileSource isDefault=true里的配置，如果有需要调整可直接设置覆盖

### getFileUrl

获取文件url

```ts
function getFileUrl(path: string, expiresIn?: number, endpoint?: string, bucket?: string): Promise<string | undefined>
```

### getFileByteArray

获取文件二进制流

```ts
function getFileByteArray(path: string, endpoint?: string, bucket?: string): Promise<Uint8Array | null>
```

### uploadFile

上传

```ts
function uploadFile(file: File, dir: string, endpoint?: string, bucket?: string): Promise<{
    path: string;
} | null>
```

### delFile

删除

```ts
function delFile(path: string, endpoint?: string, bucket?: string): Promise<true | null>
```


### getStorageUrl

根据path得到需要存储在数据库的url，方便后续解析处理

```ts
function getStorageUrl(path: string, endpoint?: string, bucket?: string): Promise<string | undefined>
```


### parseStorageUrl

存储在数据库的url转换成可展示的url

```ts
function parseStorageUrl(url: string, expiresIn?: number, endpoint?: string, bucket?: string): Promise<string | undefined>
```
