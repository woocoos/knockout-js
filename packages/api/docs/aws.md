---
sidebar_position: 1
---

# aws-s3 接口

## 使用

```tsx title=xxx.tsx
import { awsS3, getFileSource } from "@knockout-js/api";

// 使用awsS3处理文件上传
export default () => {

  const [s3, setS3] = useState<awsS3>()

  useEffect(() => {
    //这个是获取当前组织的文件源数据，如有特殊情况，请自行修改
    getFileSource().then((result) => {
      if (result) {
        setS3(
          new awsS3({
            bucket: result.source.bucket,
            endpoint: result.source.endpoint,
            region: result.source.region,
          })
        )
      }
    })
  }, [])

  return <></>
}

```

## api


### getFileUrl

获取文件url

```ts
s3.getFileUrl(path: string, expiresIn?: number): Promise<string | undefined>
```

### getFile

获取文件二进制流

```ts
s3.getFileUint8Array(path: string): Promise<Uint8Array | null>
```

### uploadFile

上传

```ts
s3.uploadFile(file: File, dir: string): Promise<{
    path: string;
} | null>
```

### delFile

删除

```ts
s3.delFile(path: string): Promise<true | null>
```


### getStorageUrl

根据path得到需要存储在数据库的url，方便后续解析处理

```ts
s3.getStorageUrl(path: string): string
```


### parseStorageUrl

存储在数据库的url转换成可展示的url

```ts
s3.parseStorageUrl(url: string, expiresIn?: number): Promise<string | undefined>
```
