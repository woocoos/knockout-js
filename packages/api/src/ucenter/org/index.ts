import { query } from '@knockout-js/ice-urql/request';
import { gql, Org, gid } from '../..';
import { instanceName } from '..';

export const cacheOrg: Record<string, Org> = {}

const orgIdListQuery = gql(/* GraphQL */`query apiOrgIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on Org{
      id,code,name
    }
  }
}`)


/**
 * 缓存org值
 * @param ids
 */
export async function updateCacheOrgListByIds(ids: (string | number)[]) {
  const cacheIds = Object.keys(cacheOrg)
  const newCacheIds = ids.filter(id => !cacheIds.includes(`${id}`))
  if (newCacheIds.length) {
    const result = await query(orgIdListQuery, {
      ids: newCacheIds.map(id => gid('org', id))
    }, {
      instanceName,
    })
    result.data?.nodes?.forEach(item => {
      if (item?.__typename === 'Org') {
        cacheOrg[item.id] = item as Org
      }
    })
  }
}
