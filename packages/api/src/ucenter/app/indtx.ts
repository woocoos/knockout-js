import { App, gid, gql } from "../..";
import { query } from "@knockout-js/ice-urql/request";
import { instanceName } from "..";

export const cacheApp: Record<string, App> = {}

const appIdListQuery = gql(/* GraphQL */`query apiAppIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on App{
      id,code,name
    }
  }
}`)

/**
 * 缓存app值
 * @param ids
 */
export async function updateCacheAppListByIds(ids: (string | number)[]) {
  const cacheIds = Object.keys(cacheApp)
  const newCacheIds = ids.filter(id => !cacheIds.includes(`${id}`))
  if (newCacheIds.length) {
    const result = await query(appIdListQuery, {
      ids: newCacheIds.map(id => gid('app', id))
    }, {
      instanceName,
    })
    result.data?.nodes?.forEach(item => {
      if (item?.__typename === 'App') {
        cacheApp[item.id] = item as App
      }
    })
  }
}
