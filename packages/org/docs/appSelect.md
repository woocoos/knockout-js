---
sidebar_label: AppSelect
---

本 Demo 演示AppSelect的用法。

```jsx preview
import { AppSelect } from '@knockout-js/org';
import {useState} from 'react';
import {Client, Provider, cacheExchange, fetchExchange} from 'urql';

export default ()  => {
  const [app,setApp] = useState();

  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });

  return  <Provider value={client}>
      <AppSelect value={app} onChange={setApp}/>
    </Provider>
}
```
