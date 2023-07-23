---
sidebar_label: 多语言
---

本 Demo 演示一行文字的用法。

```jsx preview
import {useState} from 'react';
import { OrgInput, LocaleProvider } from '@knockout-js/org';
import {Client, Provider, cacheExchange, fetchExchange} from 'urql';
import enUS from '@knockout-js/org/src/components/locale/en_US';

export default () => {
  const [org,setOrg] = useState();

  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });


  return  <Provider value={client}>
    <div>
    中文
    <OrgInput value={org} onChange={setOrg}/>
    </div>
    <div>
    英文
    <LocaleProvider locale={enUS}>
        <OrgInput value={org} onChange={setOrg}/>
    </LocaleProvider>
    </div>
  </Provider>
}
```
