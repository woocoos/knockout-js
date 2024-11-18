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
import { adminxApi,iconFontScriptUrl,msgApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: "default",
    url: adminxApi,
  },
  {
    instanceName: "msgcenter",
    url: msgApi,
  },
]);

const IconFont = createFromIconfontCN({
  scriptUrl: iconFontScriptUrl,
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
        msgProps={{
          onItemClick:(data) => {
            console.log('msg-item',data)
          },
          onListClick:() => {
            console.log('更多消息')
          }
        }}
        actionsBeforeRender={[
          <div>自定义占位</div>,
        ]}
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

使用集成应用菜单展示layout

```tsx preview
import { useState } from "react";
import { Layout } from "@knockout-js/layout";
import defaultAvatar from "./assets/default-avatar.png";
import styles from "./layout/index.module.css";
import { useLocation } from "@docusaurus/router";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { createFromIconfontCN } from "@ant-design/icons";
import { adminxApi,iconFontScriptUrl } from "./assets/api";

createUrqlInstance([
  {
    instanceName: "default",
    url: adminxApi,
  },
]);

const IconFont = createFromIconfontCN({
  scriptUrl: iconFontScriptUrl,
});

export default () => {
  const location = useLocation();

  const [tenantId, setTenantId] = useState("1");
  const [theme, setTheme] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.demoLayout}>
      <Layout
        IconFont={IconFont}
        appCode="adminx"
        pathname={location.pathname}
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
        aggregateMenuProps={{
          open:open,
          onChangeOpen:setOpen,
          onClick:(menuItem,app)=>{
            console.log(menuItem,app)
          }
        }}
      >
        <div>context</div>
      </Layout>
    </div>
  );
};
```

## props

| 属性                | 描述                           | 类型                                           | 必填 | 默认值          |
| ------------------- | ------------------------------ | ---------------------------------------------- | ---- | --------------- |
| appCode             | 应用code                       | string                                         | ✅    | -               |
| locale              | 当前语言                       | LocaleType                                     | ❌    | LocaleType.zhCN |
| pathname            | 传递动态的 location.pathname   | string                                         | ✅    | -               |
| IconFont            | 菜单启用ant iconfont 解决方案  | 上图示例                                       | ❌    | -               |
| aggregateMenuProps  | 使用应用集成菜单               | AggregateMenuProps                             | ❌    | -               |
| i18nProps           | I18nDropdown组件对应的参数     | I18nDropdownProps                              | ❌    | -               |
| tenantProps         | TenantDropdown组件对应的参数   | TenantDropdownProps                            | ✅    | -               |
| msgRef              | 调用MsgDropdown组件的内部方法  | Ref&lt;MsgDropdownRef&gt;                      | ❌    | -               |
| msgProps            | MsgDropdown组件对应的参数      | MsgDropdownProps                               | ❌    | -               |
| avatarProps         | AvatarDropdown组件对应的参数   | AvatarDropdownProps                            | ✅    | -               |
| themeSwitchProps    | ThemeSwitch组件对应的参数      | ThemeSwitchProps                               | ❌    | -               |
| proLayoutProps      | ProLayout组件对应的参数        | ProLayoutProps                                 | ❌    | -               |
| onClickMenuItem     | 菜单点击返回                   | (item: MenuDataItem,isOpen?: boolean) => void; | ❌    | -               |
| actionsBeforeRender | 顶部插槽，往前语言切换前面添加 | ReactNode[]                                    | ❌    | -               |
| children            | 默认插槽                       | ReactNode                                      | ✅    | -               |
