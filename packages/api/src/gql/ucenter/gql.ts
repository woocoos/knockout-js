/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query userMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}": types.UserMenuListDocument,
    "query userRootOrgs{\n  userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}": types.UserRootOrgsDocument,
    "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,comments,status\n          }\n        }\n      }\n    }\n  }\n}": types.OrgAppListDocument,
    "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}": types.AppListDocument,
    "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,ownerID,parentID,kind,profile,\n            domain,code,name,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.AppOrgListDocument,
    "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,ownerID,parentID,kind,profile,\n        domain,code,name,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}": types.OrgListDocument,
    "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.UserListDocument,
    "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListDocument,
    "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRoleUserListDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}"): (typeof documents)["query userMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userRootOrgs{\n  userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}"): (typeof documents)["query userRootOrgs{\n  userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,comments,status\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,comments,status\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,ownerID,parentID,kind,profile,\n            domain,code,name,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,ownerID,parentID,kind,profile,\n            domain,code,name,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,ownerID,parentID,kind,profile,\n        domain,code,name,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,ownerID,parentID,kind,profile,\n        domain,code,name,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;