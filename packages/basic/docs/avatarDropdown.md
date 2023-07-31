---
sidebar_label: AvatarDropdown
---

本 Demo 演示用法。

```jsx preview
import { AvatarDropdown, BasicProvider, LocaleType } from '@knockout-js/basic';
import defaultAvatar from './assets/default-avatar.png';

export default function App () {
  return (
    <div>
      <div>
        <AvatarDropdown
          avatar={defaultAvatar}
          name="张三" 
          onMeneActions={(event)=>{
            if (event.key == 'logout'){
              alert('click logout')
            }
          }}/>
      </div>
    </div>
  )
}
```
