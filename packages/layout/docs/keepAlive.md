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

<ReactDocgenProps path="../src/components/keep-alive/index.tsx"></ReactDocgenProps>
