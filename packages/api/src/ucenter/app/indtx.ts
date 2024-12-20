import { gid, instanceName } from "../..";
import { query } from "@knockout-js/ice-urql/request";
import { gql } from "../../gql/ucenter";
import { App } from "../../gql/ucenter/graphql";


const appIdListQuery = gql(/* GraphQL */`query apiAppIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on App{
      id,code,name,logo,status
    }
  }
}`)

const appIdQuery = gql(/* GraphQL */`query apiAppId($id:GID!){
  node(id: $id){
    ... on App{
      id,code,name,logo,status
    }
  }
}`)

/**
 * 缓存app 值
 * @param appIds
 */
export async function getApps(appIds: (string | number)[]) {
  const result = await query(appIdListQuery, {
    ids: appIds.map(id => gid('App', id))
  }, {
    instanceName: instanceName.UCENTER,
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
export async function getApp(appId: (string | number)) {
  const result = await query(appIdQuery, {
    id: gid('App', appId)
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  })

  if (result.data?.node?.__typename === 'App') {
    return result.data.node;
  }
  return null;
}
