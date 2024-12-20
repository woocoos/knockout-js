import { OrgRole, OrgRoleOrder, OrgRoleWhereInput } from '../../gql/ucenter/graphql';
import { gid, instanceName } from '../..';
import { paging, query } from '@knockout-js/ice-urql/request';
import { gql } from '../../gql/ucenter';

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

const orgRoleIdQuery = gql(/* GraphQL */`query apiOrgRoleId($id:GID!){
  node(id: $id){
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
    instanceName: instanceName.UCENTER,
  });

  if (result.data?.orgGroups) {
    return result.data?.orgGroups;
  }
  return null;
}

/**
 * 缓存orgRole值
 * @param orgRoleIds
 */
export async function getOrgRoles(orgRoleIds: (string | number)[]) {
  const result = await query(orgRoleIdListQuery, {
    ids: orgRoleIds.map(id => gid('OrgRole', id)),
    requestPolicy: "cache-first",
  }, {
    instanceName: instanceName.UCENTER,
  }), list: OrgRole[] = [];

  result.data?.nodes?.forEach(item => {
    if (item?.__typename === 'OrgRole') {
      list.push(item as OrgRole);
    }
  })

  return list;
}

/**
 * 缓存orgRole值
 * @param orgRoleId
 */
export async function getOrgRole(orgRoleId: (string | number)) {
  const result = await query(orgRoleIdQuery, {
    id: gid('OrgRole', orgRoleId),
    requestPolicy: "cache-first",
  }, {
    instanceName: instanceName.UCENTER,
  });

  if (result.data?.node?.__typename === 'OrgRole') {
    return result.data.node
  }

  return null;
}
