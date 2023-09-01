---
sidebar_label: 上传功能
---

# 上传功能

## 头像上传

```tsx preview
import { UploadAvatar } from "@knockout-js/layout";
import { useState } from "react";
import { files } from "@knockout-js/api";

files.setApiFilesPrefix('http://127.0.0.1:3002/mock-api-files')

export default () => {
  const [fileId,setFileId] = useState()

  return (
    <div>
      <UploadAvatar value={fileId} onChange={setFileId} accept=".png,.jpg,.jpeg" />
    </div>
  );
};
```

## props

