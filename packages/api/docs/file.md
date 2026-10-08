---
sidebar_position: 1
---

# file 接口

## 启用

```ts title=xxx.ts
import { getFileUrl } from "@knockout-js/api/file";

export default () => {
    const url = await getFileUrl(path)
}

```

## 支持的存储类型

- AWS S3
- 阿里云 OSS (Ali-OSS)

## api

api中的 `endpoint` `bucket` 两个非必填参数都是默取fileSource isDefault=true里的配置，如果有需要调整可直接设置覆盖

### getFileUrl

获取文件url

```ts
function getFileUrl(path: string, options?: {
    /**
     * 签名有效期，默认 3600 秒
     */
    expiresIn?: number;
    /**
     * true:浏览器内预览 | false:下载 | undefined:默认不处理
     */
    inBrowser?: boolean;
    /**
     * 响应时文件编码，例如 'utf-8'
     */
    contentEncoding?: string;
    endpoint?: string;
    bucket?: string;
}): Promise<string | null>
```

### getFileRaw

获取s3输出对象方便外部调用后自行对处理

```ts
function getFileRaw(path: string, options?: {
    endpoint?: string;
    bucket?: string;
}): Promise<GetObjectCommandOutput | null>
```

### uploadFile

上传文件

```ts
function uploadFile(file: File, dir: string, options?: {
    endpoint?: string;
    bucket?: string;
    /**
     * 使用file.name当作文件名
     */
    useFileName?: boolean;
    /**
     * 使用这个值当作文件名，不包含后缀
     */
    custromFileName?: string;
}): Promise<{
    path: string;
} | null>
```

### delFile

删除文件

```ts
function delFile(path: string, options?: {
    endpoint?: string;
    bucket?: string;
}): Promise<true | null>
```

### setStsApi

修改STS API请求地址，默认请求地址：`/api-s3/oss/sts`

```ts
function setStsApi(api: string): void
```

### getStorageUrl

根据path得到需要存储在数据库的url，方便后续解析处理

```ts
function getStorageUrl(path: string, options?: {
    endpoint?: string;
    bucket?: string;
}): Promise<string | undefined>
```

### parseStorageUrl

存储在数据库的url转换成可展示的url

```ts
function parseStorageUrl(storageUrl: string, options?: {
    /**
     * 签名有效期，默认 3600 秒
     */
    expiresIn?: number;
    /**
     * true:浏览器内预览 | false:下载 | undefined:默认不处理
     */
    inBrowser?: boolean;
    /**
     * 响应时文件编码，例如 'utf-8'
     */
    contentEncoding?: string;
    endpoint?: string;
    bucket?: string;
}): Promise<string | undefined>
```

### parseStorageData

存储在数据库的url转换成完整的相关信息，包含文件名等

```ts
type UploadFileRes = {
    /**
     * 文件路径
     */
    path: string;
    /**
     * 存储用的url
     */
    storageUrl: string;
    /**
     * 可访问的url
     */
    url: string;
    /**
     * 文件名
     */
    name: string;
}

function parseStorageData(storageUrl: string, options?: {
    /**
     * 签名有效期，默认 3600 秒
     */
    expiresIn?: number;
    /**
     * true:浏览器内预览 | false:下载 | undefined:默认不处理
     */
    inBrowser?: boolean;
    /**
     * 响应时文件编码，例如 'utf-8'
     */
    contentEncoding?: string;
    endpoint?: string;
    bucket?: string;
}): Promise<UploadFileRes | undefined>
```
