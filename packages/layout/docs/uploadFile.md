---
sidebar_label: 上传功能
---
# 上传功能

演示各种封装好的上转组件

## 通用props

| 属性           | 描述                        | 类型                                    | 必填 | 默认值 |
| -------------- | --------------------------- | --------------------------------------- | ---- | ------ |
| bucket         | 文件上传bucket              | string                                  | ❌    | local  |
| appCode        | 应用code                    | string                                  | ❌    | -      |
| tenantId       | tenantId                    | string                                  | ❌    | -      |
| directory      | 自定义目录                  | string                                  | ❌    | -      |
| forceDirectory | 强制目录当作key             | string                                  | ❌    | -      |
| maxSize        | 文件大小限制 （字节为单位） | number                                  | ❌    | 5M     |
| accept         | 接受上传的文件类型          | string                                  | ❌    | -      |
| value          | 上传的id                    | string &#124; string[]                  | ❌    | -      |
| onChange       | 返回上传的id                | (value: string &#124; string[]) => void | ❌    | -      |
| onChangePath   | 返回上传的path              | (path: string &#124; string[]) => void  | ❌    | -      |

根据组件是多选还是单选决定`value`是返回数组还是单个，同时`onChange`,`onChangePath`也是一样

## key说明

默认key生成规则：/${appCode}/${tenantId}/${directory}/随机数.xxx

启用`forceDirectory`规则变为: /${directory}/随机数.xxx

`onChangePath`: 是获取key的唯一方式，key目前是一个中间值一般是后端需要才返回记录基本上上传文件需要特殊使用这个方法

## UploadAvatar

针对头像上传

```tsx preview
import { UploadAvatar } from "@knockout-js/layout";
import { useState } from "react";
import { files } from "@knockout-js/api";
import { fileApi } from "./assets/api";

files.setApiFilesPrefix(fileApi)

export default () => {
  const [fileId,setFileId] = useState()
  const [key,setKey] = useState()

  return (
    <div>
      <div>ID:{fileId}</div>
      <div>KEY:{key}</div>
      <UploadAvatar 
        value={fileId} 
        onChange={setFileId} 
        onChangePath={setKey} 
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
import { files } from "@knockout-js/api";
import { fileApi } from "./assets/api";

files.setApiFilesPrefix(fileApi)

export default () => {
  const [fileId,setFileId] = useState([])
  const [keys,setKeys] = useState([])

  return (
    <div>
      <div>ID:{fileId.join(',')}</div>
      <div>KEYS:{keys.join(',')}</div>
      <UploadMultiple 
        value={fileId} 
        onChange={setFileId} 
        onChangePath={setKeys} 
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
import { files } from "@knockout-js/api";
import { fileApi } from "./assets/api";

files.setApiFilesPrefix(fileApi)

export default () => {
  const [fileId,setFileId] = useState()
  const [key,setKey] = useState()

  return (
    <div>
      <div>ID:{fileId}</div>
      <div>KEY:{key}</div>
      <UploadTemp 
        value={fileId} 
        onChange={setFileId} 
        onChangePath={setKey} 
        accept=".tmpl" 
      />
    </div>
  );
};
```
