import { test, expect } from 'vitest';
import * as React from 'react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { OrgInput } from '@knockout-js/org';
import { Provider, Client, cacheExchange, fetchExchange } from 'urql';
import { useState } from "react";
import { orgListQuery } from "@knockout-js/api";

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

test('render orgInput', async () => {
  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });

  const {result} = renderHook(() => useState({id: '1', name: 'org1'}))
  const [org, setOrg] = result.current;
  const ele = render(<Provider value={client}>
    <OrgInput value={org} onChange={setOrg} orgId={org.id}
    />
  </Provider>);

  // 模拟点击
  // fireEvent.click(ele.container.querySelector('.anticon-search') as Element)

  expect(ele.getByDisplayValue('org1')).toBeDefined();

});
