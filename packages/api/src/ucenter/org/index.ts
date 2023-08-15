import { query } from '@knockout-js/ice-urql/request';
import { gql, Org, gid } from '../..';
import { instanceName } from '..';

const orgIdListQuery = gql(/* GraphQL */`query apiOrgIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on Org{
      id,code,name
    }
  }
}`)

const orgIdQuery = gql(/* GraphQL */`query apiOrgId($id:GID!){
  node(id: $id){
    ... on Org{
      id,code,name
    }
  }
}`)


/**
 * 缓存org值
 * @param orgIds
 */
export async function getOrgs(orgIds: (string | number)[]) {
  const result = await query(orgIdListQuery, {
    ids: orgIds.map(id => gid('org', id))
  }, {
    instanceName,
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
    id: gid('org', orgId)
  }, {
    instanceName,
    requestPolicy: "cache-first",
  });

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node
  }

  return null;
}
