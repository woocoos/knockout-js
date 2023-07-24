import {test, expect, vitest} from 'vitest';
import * as React from 'react';
import {render, renderHook, screen} from '@testing-library/react';

import {OrgInput} from '@knockout-js/org';
import {Client, Provider, cacheExchange, fetchExchange} from 'urql';
import {useState} from "react";

test('render orgInput', () => {
  const client = new Client({
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
    exchanges: [cacheExchange, fetchExchange],
  });
  vitest.mock('http://127.0.0.1:3001/mock-api-adminx/graphql/query', () => {
    return {data: {orgList: {data: [{id: '1', name: 'org1'}]}}};
  });
  const {result} = renderHook(() => useState({id: '1', name: 'org1'}))
  const [org, setOrg] = result.current;
  render(<Provider value={client}>
    <OrgInput value={org} onChange={setOrg} disabled={false} orgId={org.id}
              searchProps={{loading: true}}
    />
  </Provider>);
  expect(screen.getAllByText('org1')).toBeDefined();
});
