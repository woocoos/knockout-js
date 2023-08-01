---
sidebar_label: KeepAlive
---

本 Demo 演示用法。

```tsx preview
import { useState } from "react";
import { KeepAlive, ThemeSwitch } from "@knockout-js/layout";
import { AliveScope } from "react-activation";

const CustomPage = () => {
  const [num, setNum] = useState(0);
  return (
    <div>
      {num}
      <button
        onClick={() => {
          setNum(num + 1);
        }}
      >
        +
      </button>
    </div>
  );
};

export default () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <a onClick={() => setShow(!show)}>切换：{show ? "移除" : "回显"}</a>

      <AliveScope>
        {show && (
          <KeepAlive>
            <CustomPage />
          </KeepAlive>
        )}
      </AliveScope>
    </div>
  );
};
```

## props

| 参数       | 说明         | 类型            | 默认值 |
| ---------- | ------------ | --------------- | ------ |
| id         | id           | string          | -      |
| clearAlive | 是否清理缓存 | boolean         | -      |
| children   | 包裹的内容   | react.ReactNode | -      |
