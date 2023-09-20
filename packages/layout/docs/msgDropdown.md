---
sidebar_label: MsgDropdown
---

本 Demo 演示用法。

```tsx preview
import { MsgDropdown } from "@knockout-js/layout";
import defaultAvatar from "./assets/default-avatar.png";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
import { msgApi } from "./assets/api";
import { useRef } from "react";
import { Button } from 'antd';

createUrqlInstance([
  {
    instanceName: 'default',
    url: msgApi,
  }
])

export default () => {
  const mdRef = useRef();

  return (
    <>
      <Button 
        onClick={() => {
          mdRef.current.setShowDot();
        }}>点亮红点</Button>
      <MsgDropdown ref={mdRef} onMoreClick={() => {}} />
    </>
  );
};
```

## props

| 属性        | 描述         | 类型                          | 必填 | 默认值 |
| ----------- | ------------ | ----------------------------- | ---- | ------ |
| maxLength   | 最多显示几条 | number                        | ❌    | 5      |
| onItemClick | 选中一项     | (data: MsgInternalTo) => void | ❌    | -      |
| onMoreClick | 查看更多     | () => void                    | ❌    | -      |

## ref

MsgDropdownRef

| 方法       | 描述     | 类型       |
| ---------- | -------- | ---------- |
| setShowDot | 点亮红点 | () => void |
