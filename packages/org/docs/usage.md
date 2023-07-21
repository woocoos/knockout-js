---
sidebar_label: OrgInput
---

本 Demo 演示一行文字的用法。

```jsx preview
import { OrgInput } from '@knockout-js/org';
import React,{useEffect,useState} from 'react';
import {Client, Provider, cacheExchange, fetchExchange} from 'urql';
import i18n from 'i18next';
import {ConfigProvider} from 'antd';
import { initReactI18next } from 'react-i18next';
import ko_zhCN from '@knockout-js/org/src/locale/zh-CN';
import zhCN from 'antd/locale/zh_CN';

// 多语言文件
const resources = {
  zh_CN: {translation:ko_zhCN},
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh_CN',
    interpolation: {
      escapeValue: false,
    },
  });

export default function App() {
  const [org,setOrg] = useState();

  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });

   useEffect(() => {
    i18n.changeLanguage("zh_CN");
   });

  return  <ConfigProvider locale={zhCN}>
      <Provider value={client}>
      <OrgInput value={org} onChange={setOrg}/>
    </Provider>
  </ConfigProvider>
}
```
