---
sidebar_label: Modal
---
支持全屏和头部拖动的modal

本 Demo 演示用法。

```tsx preview
import { useState } from "react";
import { Button } from "antd";
import { Modal } from "@knockout-js/layout";


export default () => {
  const [open, setOpen] = useState(false);

  return (<>
     <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        弹框
      </Button>
    <Modal 
      open={open} 
      title={'头部可拖动'}
      onOk={() => {
        setOpen(false);
      }}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <div>内容</div>  
    </Modal>
    </>
  );
};
```
## Props

扩展ant的modal，支持原有的[props](https://ant-design.antgroup.com/components/modal-cn#api)设置

新增props

| 属性             | 描述                          | 类型                  | 必填 | 默认值 |
| ---------------- | ----------------------------- | --------------------- | ---- | ------ |
| isDraggable      | 是否可拖拽                    | boolean               | ❌    | true   |
| defaultScreenful | 全屏默认值                    | boolean               | ❌    | false  |
| screenfulIcon    | 全屏图标，设置false不出现图标 | ReactNode &#124 false | ❌    | -      |
