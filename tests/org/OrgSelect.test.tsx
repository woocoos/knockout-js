import { test, expect } from 'vitest';
import * as React from 'react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { OrgSelect } from '@knockout-js/org';
import { useState } from "react";
import { OrgKind } from "@knockout-js/api";
import { query } from '@knockout-js/ice-urql/request';
import { gql } from 'urql'
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

const orgListQuery = gql(/* GraphQL */`query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  organizations(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name
      }
    }
  }
}`);

test('mocktest', async () => {
  const result = await query(orgListQuery, {
    first: 10,
  })

  console.log('--result--', result)
  expect(result.data).toBeDefined()
});

test('render OrgSelect', async () => {
  const { result } = renderHook(() => useState({ id: '1', name: 'org1' }))
  const [org, setOrg] = result.current;
  const ele = render(
    <OrgSelect value={org} onChange={setOrg} orgId={org.id} kind={OrgKind.Root} />
  );

  // 模拟点击
  // fireEvent.click(ele.container.querySelector('.anticon-search') as Element)
  expect(ele.getByDisplayValue('org1')).toBeDefined();
});
