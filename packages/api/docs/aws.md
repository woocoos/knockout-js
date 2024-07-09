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


### getFile

获取

```ts
// 会默认给展示的url，如果需要文件对象的需要修改outputType=uint8Array
s3.getFile(path: string, outputType?: "url" | "uint8Array"): Promise<string | Uint8Array | null>
```

### uploadFile

上传

```ts
s3.uploadFile(file: File, dir: string): Promise<{
    path: string;
    storageUrl: string;
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

解析存储在数据库的url

```ts
s3.parseStorageUrl(url: string): {
    endpoint: string;
    bucket: string;
    path: string;
}
```
