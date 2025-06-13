import { query } from '@knockout-js/ice-urql/request';
import { gid, instanceName } from '../..';
import { AppActionKind, AppActionMethod, User } from '../../gql/ucenter/graphql';
import { gql } from '../../gql/ucenter';

const userIdListQuery = gql(/* GraphQL */`query apiUserIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on User{
      id,displayName
    }
  }
}`)

const userIdQuery = gql(/* GraphQL */`query apiUserId($id:GID!){
  node(id: $id){
    ... on User{
      id,displayName
    }
  }
}`)

const userPermissionListQuery = gql(/* GraphQL */`query apiUserPermissionList($where: AppActionWhereInput){
  userPermissions(where: $where){
    id,appID,name,kind,method
  }
}`);

/**
 * 获取用户的权限
 * @param headers
 * @returns
 */
export async function userPermissions(appCode: string, headers?: Record<string, any>) {
  const result = await query(
    userPermissionListQuery,
    {
      where: {
        hasAppWith: [{ code: appCode, }],
        or: [
          { kind: AppActionKind.Route },
          { kind: AppActionKind.Function },
          { method: AppActionMethod.Write },
        ],
      }
    },
    {
      instanceName: instanceName.UCENTER,
      requestPolicy: "cache-first",
      fetchOptions: { headers },
    }
  );

  if (result.data?.userPermissions) {
    return result?.data?.userPermissions;
  }
  return null;
}

/**
 * 缓存user值
 * @param userIds
 */
export async function getUsers(userIds: (string | number)[]) {
  const result = await query(userIdListQuery, {
    ids: userIds.map(id => gid('User', id))
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  }), list: User[] = [];

  result.data?.nodes?.forEach(item => {
    if (item?.__typename === 'User') {
      list.push(item as User)
    }
  })

  return list;
}

/**
 * 缓存user值
 * @param userId
 */
export async function getUser(userId: (string | number)) {
  const result = await query(userIdQuery, {
    id: gid('User', userId)
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  });

  if (result.data?.node?.__typename === 'User') {
    return result.data.node
  }

  return null;
}

export const cacheUser: Record<string, User | undefined> = {}

/**
 * 获取用户对象
 * @param id
 * @returns
 */
export const getCacheUser = async (id: string) => {
  if (!cacheUser[id]) {
    const result = await getUser(id)
    if (result) {
      cacheUser[id] = result as User
    }
  }
  return cacheUser[id]
}

/**
 * 批量初始化
 * @param ids
 */
export const batchInitCacheUser = async (ids: string[]) => {
  const cacheIds = Object.keys(cacheUser)
  const needIds = ids.filter(id => !cacheIds.includes(id))
  const result = await getUsers(needIds)
  result.forEach(item => cacheUser[item.id] = item as User)
}