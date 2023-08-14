import { query } from '@knockout-js/ice-urql/request';
import { instanceName } from '..';
import { AppActionKind, AppActionMethod, User, gid, gql } from '../..';

export const cacheUser: Record<string, User> = {}

const userIdListQuery = gql(/* GraphQL */`query apiUserIdList($ids:[GID!]!){
  nodes(ids: $ids){
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
          { kind: AppActionKind.Function },
          { kindNEQ: AppActionKind.Function, method: AppActionMethod.Write }
        ],
      }
    },
    {
      instanceName,
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
 * @param ids
 */
export async function updateCacheUserListByIds(ids: (string | number)[]) {
  const cacheIds = Object.keys(cacheUser)
  const newCacheIds = ids.filter(id => !cacheIds.includes(`${id}`))
  if (newCacheIds.length) {
    const result = await query(userIdListQuery, {
      ids: newCacheIds.map(id => gid('user', id))
    }, {
      instanceName,
    })
    result.data?.nodes?.forEach(item => {
      if (item?.__typename === 'User') {
        cacheUser[item.id] = item as User
      }
    })
  }
}
