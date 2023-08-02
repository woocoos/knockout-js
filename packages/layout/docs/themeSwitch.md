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

| 参数          | 说明                                                | 类型                     | 默认值 |
|-------------|---------------------------------------------------|------------------------|-----|
| value       | 值                                                 | boolean                | -   |
| switchProps | [参考](https://ant.design/components/switch-cn#api) | SwitchProps            | -   |
| onChange    | 更新值                                               | (value?:boolean)=>void | -   |
