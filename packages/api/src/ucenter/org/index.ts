import { query } from '@knockout-js/ice-urql/request';
import { gid, instanceName } from '../..';
import { gql } from '../../gql/ucenter';
import { Org } from '../../gql/ucenter/graphql';

const orgIdListQuery = gql(/* GraphQL */`query apiOrgIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on Org{
      id,code,name,localCurrency
    }
  }
}`)

const orgIdQuery = gql(/* GraphQL */`query apiOrgId($id:GID!){
  node(id: $id){
    ... on Org{
      id,code,name,localCurrency
    }
  }
}`)


/**
 * 缓存org值
 * @param orgIds
 */
export async function getOrgs(orgIds: (string | number)[]) {
  const result = await query(orgIdListQuery, {
    ids: orgIds.map(id => gid('Org', id))
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  }), list: Org[] = [];

  result.data?.nodes?.forEach(item => {
    if (item?.__typename === 'Org') {
      list.push(item as Org)
    }
  })

  return list;
}

/**
 * 缓存org值
 * @param orgId
 */
export async function getOrg(orgId: (string | number)) {
  const result = await query(orgIdQuery, {
    id: gid('Org', orgId)
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  });

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node
  }

  return null;
}