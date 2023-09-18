---
sidebar_label: MsgDropdown
---

本 Demo 演示用法。

```tsx preview
import { MsgDropdown } from "@knockout-js/layout";
import defaultAvatar from "./assets/default-avatar.png";

export default () => {
  const dataSource = [
     {
          content: '',
          format: '',
          sendAt: Date.now(),
          title: '标题1',
          topic: 'messages',
          url: ''
      },
      {
          content: '',
          format: '',
          sendAt: Date.now(),
          title: '标题2',
          topic: 'messages',
          url: ''
      }
  ]

  return (
      <MsgDropdown dataSource={dataSource}/>
  );
};
```

## props

| 属性        | 描述     | 类型                    | 必填 | 默认值 |
| ----------- | -------- | ----------------------- | ---- | ------ |
| dataSource  | 数据源   | Message[]               | ❌    | -      |
| onItemClick | 选中一项 | (data: Message) => void | ❌    | -      |
| onListClick | 查看更多 | () => void              | ❌    | -      |
