---
sidebar_label: Layout
---

本 Demo 演示用法。

```tsx preview
import { useState } from "react";
import { Layout } from "@knockout-js/layout";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import defaultAvatar from "./assets/default-avatar.png";
import styles from "./layout/index.module.css";
import { ControlOutlined } from "@ant-design/icons";

export default () => {
  const client = new Client({
    url: "http://127.0.0.1:3001/mock-api-adminx/graphql/query",
    exchanges: [cacheExchange, fetchExchange],
  });
  const [tenantId, setTenantId] = useState("1");
  const [theme, setTheme] = useState(false);
  const [locale, setLocale] = useState("zh-cn"),
    menuItems = [
      { key: "zh-cn", label: "中文" },
      { key: "en-us", label: "En" },
    ];

  return (
    <div className={styles.demoLayout}>
      <Provider value={client}>
        <Layout
          onClickMenuItem={(item, isOpen) => {
            console.log(item, isOpen);
          }}
          i18nProps={{
            value: locale,
            menuItems: menuItems,
            onChange: setLocale,
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
                    icon: <ControlOutlined />,
                  },
                ];
              },
            },
          }}
        >
          <div>context</div>
        </Layout>
      </Provider>
    </div>
  );
};
```

## props

<ReactDocgenProps path="../src/components/layout/index.tsx"></ReactDocgenProps>
