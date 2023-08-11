---
sidebar_label: AvatarDropdown
---

本 Demo 演示用法。

```tsx preview
import { AvatarDropdown } from "@knockout-js/layout";
import defaultAvatar from "./assets/default-avatar.png";

export default () => {
  return (
    <div style={{ width: "100px" }}>
      <AvatarDropdown
        avatar={defaultAvatar}
        name="张三"
        onLogoutClick={() => {
          alert("click logout");
        }}
      />
    </div>
  );
};
```

## props

<ReactDocgenProps path="../src/components/avatar-dropdown/index.tsx"></ReactDocgenProps>
