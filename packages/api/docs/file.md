---
sidebar_position: 1
---

# file 接口

## 启用

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
function getFileUrl(path: string, expiresIn?: number, inBrowser?: boolean, endpoint?: string, bucket?: string): Promise<string | undefined>
```

### getFileRaw

获取s3输出对象方便外部调用后自行对处理

```ts
function getFileRaw(path: string, endpoint?: string, bucket?: string): Promise<GetObjectCommandOutput | null>
```

### uploadFile

上传

```ts
function uploadFile(file: File, dir: string, useFileName?: boolean, endpoint?: string, bucket?: string): Promise<{
    path: string;
} | null>
```

### delFile

删除

```ts
function delFile(path: string, endpoint?: string, bucket?: string): Promise<true | null>
```


### setStsApi

修改sts api地址 默认请求地址：`/api-s3/oss/sts`

```ts
function setStsApi(api: string): void
```

### getStorageUrl

根据path得到需要存储在数据库的url，方便后续解析处理

```ts
function getStorageUrl(path: string, endpoint?: string, bucket?: string): Promise<string | undefined>
```


### parseStorageUrl

存储在数据库的url转换成可展示的url

```ts
function parseStorageUrl(storageUrl: string, expiresIn?: number, inBrowser?: boolean, endpoint?: string, bucket?: string): Promise<string | undefined>
```

### parseStorageData

存储在数据库的url转换成想要的关键的UploadFileRes信息

```ts
type UploadFileRes = {
    path: string;
    storageUrl: string;
    url: string;
    name: string;
}

function parseStorageData(storageUrl: string, expiresIn?: number, inBrowser?: boolean, endpoint?: string, bucket?: string): Promise<UploadFileRes | undefined>
```
