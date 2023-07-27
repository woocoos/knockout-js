import {gql} from '../gql/ucenter';



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
