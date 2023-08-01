---
sidebar_label: AvatarDropdown
---

本 Demo 演示用法。

```tsx preview
import { AvatarDropdown} from "@knockout-js/layout";
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

| 参数          | 说明                                              | 类型      | 默认值 |
| ------------- | ------------------------------------------------- | --------- | ------ |
| avatar        | 头像                                              | boolean   | -      |
| name          | 名称                                              | string    | -      |
| menu          | [参考](https://ant.design/components/menu-cn#api) | MenuProps | -      |
| onLogoutClick | 退出登陆                                          | ()=>void  | -      |
