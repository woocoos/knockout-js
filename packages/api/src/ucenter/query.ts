import {gql} from '../gql/ucenter';

export const orgListQuery = gql(/* GraphQL */`query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  organizations(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,ownerID,parentID,kind,profile,
        domain,code,name,countryCode,timezone,
        owner { id,displayName }
      }
    }
  }
}`);

export const appListQuery = gql(/* GraphQL */`query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  apps(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,
        refreshTokenValidity,logo,comments,status,createdAt
      }
    }
  }
}`);
