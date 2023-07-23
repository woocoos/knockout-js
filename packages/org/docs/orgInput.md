---
sidebar_label: OrgInput
---

本 Demo 演示一行文字的用法。

```jsx preview
import { OrgInput } from '@knockout-js/org';
import {useState} from 'react';
import {Client, Provider, cacheExchange, fetchExchange} from 'urql';

export default ()  => {
  const [org,setOrg] = useState();

  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });


  return  <Provider value={client}>
      <OrgInput value={org} onChange={setOrg}/>
    </Provider>
}
```
