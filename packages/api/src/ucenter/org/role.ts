import { OrgRole, OrgRoleOrder, OrgRoleWhereInput, gid, gql } from '../..';
import { paging, query } from '@knockout-js/ice-urql/request';
import { instanceName } from '..';

export const cacheOrgRole: Record<string, OrgRole> = {}

const orgGroupListQuery = gql(/* GraphQL */`query apiOrgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  orgGroups(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,orgID,kind,name,comments
      }
    }
  }
}`);

const orgRoleIdListQuery = gql(/* GraphQL */`query apiOrgRoleIdList($ids:[GID!]!){
  nodes(ids: $ids){
    ... on OrgRole{
      id,orgID,kind,name
    }
  }
}`)


/**
 * 获取组织用户组
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgGroupList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgRoleWhereInput;
    orderBy?: OrgRoleOrder;
  },
) {
  const result = await paging(
    orgGroupListQuery, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1, {
    instanceName,
  });

  if (result.data?.orgGroups) {
    return result.data?.orgGroups;
  }
  return null;
}

/**
 * 缓存orgRole值
 * @param ids
 */
export async function updateCacheOrgRoleListByIds(ids: (string | number)[]) {
  const cacheIds = Object.keys(cacheOrgRole)
  const newCacheIds = ids.filter(id => !cacheIds.includes(`${id}`))
  if (newCacheIds.length) {
    const result = await query(orgRoleIdListQuery, {
      ids: newCacheIds.map(id => gid('org_role', id))
    }, {
      instanceName,
    });
    result.data?.nodes?.forEach(item => {
      if (item?.__typename === 'OrgRole') {
        cacheOrgRole[item.id] = item as OrgRole
      }
    })
  }
}
