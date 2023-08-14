---
sidebar_label: Layout
---

本 Demo 演示用法。

```tsx preview
import { useState } from "react";
import { Layout } from "@knockout-js/layout";
import defaultAvatar from "./assets/default-avatar.png";
import styles from "./layout/index.module.css";
import { useLocation } from "@docusaurus/router";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { createFromIconfontCN } from "@ant-design/icons";

createUrqlInstance([
  {
    instanceName: "default",
    url: "http://127.0.0.1:3001/mock-api-adminx/graphql/query",
  },
]);

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_216310_94k60yc8fg.js",
});

export default () => {
  const location = useLocation();

  const [tenantId, setTenantId] = useState("1");
  const [theme, setTheme] = useState(false);

  return (
    <div className={styles.demoLayout}>
      <Layout
        IconFont={IconFont}
        appCode="adminx"
        pathname={location.pathname}
        onClickMenuItem={(item, isOpen) => {
          console.log(item, isOpen);
        }}
        tenantProps={{
          value: tenantId,
          onChange: setTenantId,
        }}
        avatarProps={{
          avatar: defaultAvatar,
          name: "张三",
          onLogoutClick: () => {
            alert("click logout");
          },
        }}
        themeSwitchProps={{
          value: theme,
          onChange: setTheme,
        }}
        proLayoutProps={{
          menu: {
            request: async () => {
              return [
                {
                  name: "工作台",
                  path: "/",
                  icon: <IconFont type="yakIcon-home" />,
                },
                {
                  name: "菜单1",
                  icon:  <IconFont type="yakIcon-daiyue" /> ,
                  children: [
                    {
                      name: "菜单1-1",
                      path: "/",
                    },
                  ],
                },
              ];
            },
          },
        }}
      >
        <div>context</div>
      </Layout>
    </div>
  );
};
```

## props

<!-- <ReactDocgenProps path="../src/components/layout/index.tsx"></ReactDocgenProps> -->

| 属性             | 描述                          | 类型                                           | 必填 | 默认值 |
| ---------------- | ----------------------------- | ---------------------------------------------- | ---- | ------ |
| appCode          | 应用code                      | string                                         | ✅   | -      |
| pathname         | 传递动态的 location.pathname  | string                                         | ✅   | -      |
| IconFont         | 菜单启用ant iconfont 解决方案 | 上图示例                                       | ❌   | -      |
| i18nProps        | I18nDropdown组件对应的参数    | I18nDropdownProps                              | ❌   | -      |
| tenantProps      | TenantDropdown组件对应的参数  | TenantDropdownProps                            | ✅   | -      |
| avatarProps      | AvatarDropdown组件对应的参数  | AvatarDropdownProps                            | ✅   | -      |
| themeSwitchProps | ThemeSwitch组件对应的参数     | ThemeSwitchProps                               | ✅   | -      |
| proLayoutProps   | ProLayout组件对应的参数       | ProLayoutProps                                 | ❌   | -      |
| onClickMenuItem  | 菜单点击返回                  | (item: MenuDataItem,isOpen?: boolean) => void; | ❌   | -      |
| children         | 默认插槽                      | ReactNode                                      | ✅   | -      |
