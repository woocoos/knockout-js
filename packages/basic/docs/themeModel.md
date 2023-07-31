---
sidebar_label: ThemeModel
---

本 Demo 演示用法。

```jsx preview
import { ThemeModel, BasicProvider, LocaleType } from '@knockout-js/basic';

export default function App () {
  return (
    <div>
      <div>
        中文
        <ThemeModel darkModel={false} onChange={(darkModel) => {
          alert(darkModel)
        }} />
      </div>
      <div>
        英文
        <BasicProvider locale={LocaleType.enUS}>
          <ThemeModel darkModel={false} onChange={(darkModel) => {
            alert(darkModel)
          }} />
        </BasicProvider>
      </div>
    </div>
  )
}
```
