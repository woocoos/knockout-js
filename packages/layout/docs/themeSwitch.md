---
sidebar_label: ThemeSwitch
---

本 Demo 演示用法。

```tsx preview
import { ThemeSwitch, BasicProvider, LocaleType } from "@knockout-js/layout";
import { useState } from "react";

export default () => {
  const [theme, setTheme] = useState(false);

  return (
    <div>
      <div>{theme ? "亮" : "暗"}</div>
      <div>
        中文：
        <ThemeSwitch value={theme} onChange={setTheme} />
      </div>
      <div>
        英文：
        <BasicProvider locale={LocaleType.enUS}>
          <ThemeSwitch value={theme} onChange={setTheme} />
        </BasicProvider>
      </div>
    </div>
  );
};
```

## props

<ReactDocgenProps path="../src/components/theme-switch/index.tsx"></ReactDocgenProps>
