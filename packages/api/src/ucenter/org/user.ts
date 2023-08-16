import { UserOrder, UserWhereInput, gid, gql } from '../..';
import { paging } from '@knockout-js/ice-urql/request';
import { instanceName } from '..';

const orgUserListQuery = gql(/* GraphQL */`query apiOrgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  node(id:$gid){
    ... on Org{
      id,
      users(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,displayName,email
          }
        }
      }
    }
  }
}`);

/**
 * 组织下的用户信息
 * @param orgId
 * @returns
 */
export async function getOrgUserList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: UserWhereInput;
    orderBy?: UserOrder;
  },
) {
  const result = await paging(
    orgUserListQuery, {
    gid: gid('org', orgId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1, {
    instanceName,
  });

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.users;
  }
  return null;
}