import { test, expect } from 'vitest';
import * as React from 'react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { CClient, OrgSelect } from '@knockout-js/org';
import { Provider, Client, cacheExchange, fetchExchange } from 'urql';
import { useState } from "react";
import { OrgKind, orgListQuery } from "@knockout-js/api";

test('mocktest', async () => {
  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });

  const result = await client.query(orgListQuery, {
    first: 10,
  }).toPromise()

  console.log('--result--', result)
  expect(result.data).toBeDefined()

});

test('render OrgSelect', async () => {
  const url = 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    client = new Client({
      url,
      exchanges: [cacheExchange, fetchExchange],
    }) as CClient;

  client.url = url

  const { result } = renderHook(() => useState({ id: '1', name: 'org1' }))
  const [org, setOrg] = result.current;
  const ele = render(<Provider value={client}>
    <OrgSelect value={org} onChange={setOrg} orgId={org.id} kind={OrgKind.Root}    />
  </Provider>);

  // 模拟点击
  // fireEvent.click(ele.container.querySelector('.anticon-search') as Element)

  expect(ele.getByDisplayValue('org1')).toBeDefined();

});
