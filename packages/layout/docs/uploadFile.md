---
sidebar_label: 上传功能
---
# 上传功能

演示各种封装好的上转组件

## 通用props

| 属性      | 描述                        | 类型                                    | 必填 | 默认值 |
| --------- | --------------------------- | --------------------------------------- | ---- | ------ |
| directory | 存储位置目录                | string                                  | ✅    | -      |
| bucket    | 文件上传bucket              | string                                  | ❌    | -      |
| endpoint  | endpoint                    | string                                  | ❌    | -      |
| maxSize   | 文件大小限制 （字节为单位） | number                                  | ❌    | 5M     |
| accept    | 接受上传的文件类型          | string                                  | ❌    | -      |
| value     | 上传的id                    | string &#124; string[]                  | ❌    | -      |
| onChange  | 返回上传的id                | (value: string &#124; string[]) => void | ❌    | -      |

根据组件是多选还是单选决定`value`是返回数组还是单个，同时`onChange`也是一样

## UploadAvatar

针对头像上传

```tsx preview
import { UploadAvatar } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  // 数据库存储的url
  const [storageUrl,setStorageUrl] = useState()

  return (
    <div>
      <div>storageUrl:{storageUrl}</div>
      <UploadAvatar 
        value={storageUrl} 
        onChange={setStorageUrl} 
        directory="avatar"
        accept=".png,.jpg,.jpeg" 
      />
    </div>
  );
};
```

## UploadMultiple

多选上传

```tsx preview
import { UploadMultiple } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  const [storageUrl,setStorageUrl] = useState([])

  return (
    <div>
      <div>storageUrl:{storageUrl.join(';')}</div>
      <UploadMultiple 
        value={storageUrl} 
        onChange={setStorageUrl} 
        accept=".png,.jpg,.jpeg" 
      />
    </div>
  );
};
```

## UploadTemp

上传模板包含模板的预览和下载

### props

在通用的[props](#通用props)基础上扩展

| 属性       | 描述         | 类型    | 必填 | 默认值 |
| ---------- | ------------ | ------- | ---- | ------ |
| showDelBtn | 显示删除按钮 | boolean | ❌    | -      |


```tsx preview
import { UploadTemp } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  const [storageUrl,setStorageUrl] = useState()

  return (
    <div>
      <div>storageUrl:{storageUrl}</div>
      <UploadTemp 
        value={storageUrl} 
        onChange={setStorageUrl} 
        accept=".tmpl" 
      />
    </div>
  );
};
```
