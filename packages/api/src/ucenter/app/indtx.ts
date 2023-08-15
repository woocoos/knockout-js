import { App, gid, gql } from "../..";
import { query } from "@knockout-js/ice-urql/request";
import { instanceName } from "..";


const appIdListQuery = gql(/* GraphQL */`query apiAppIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on App{
      id,code,name
    }
  }
}`)

const appIdQuery = gql(/* GraphQL */`query apiAppId($id:GID!){
  node(id: $id){
    ... on App{
      id,code,name
    }
  }
}`)

/**
 * 缓存app 值
 * @param appIds
 */
export async function getCacheApps(appIds: (string | number)[]) {
  const result = await query(appIdListQuery, {
    ids: appIds.map(id => gid('app', id))
  }, {
    instanceName,
    requestPolicy: "cache-first",
  }), list: App[] = [];

  result.data?.nodes?.forEach(item => {
    if (item?.__typename === 'App') {
      list.push(item as App);
    }
  })

  return list;
}

/**
 * 缓存app 值
 * @param appId
 */
export async function getCacheApp(appId: (string | number)) {
  const result = await query(appIdQuery, {
    id: gid('app', appId)
  }, {
    instanceName,
    requestPolicy: "cache-first",
  })

  if (result.data?.node?.__typename === 'App') {
    return result.data.node;
  }
  return null;
}
