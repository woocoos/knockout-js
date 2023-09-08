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
    "query apiAppIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on App{\n      id,code,name\n    }\n  }\n}": types.ApiAppIdListDocument,
    "query apiAppId($id:GID!){\n  node(id: $id){\n    ... on App{\n      id,code,name\n    }\n  }\n}": types.ApiAppIdDocument,
    "query apiOrgIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on Org{\n      id,code,name\n    }\n  }\n}": types.ApiOrgIdListDocument,
    "query apiOrgId($id:GID!){\n  node(id: $id){\n    ... on Org{\n      id,code,name\n    }\n  }\n}": types.ApiOrgIdDocument,
    "query apiOrgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,orgID,kind,name,comments\n      }\n    }\n  }\n}": types.ApiOrgGroupListDocument,
    "query apiOrgRoleIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}": types.ApiOrgRoleIdListDocument,
    "query apiOrgRoleId($id:GID!){\n  node(id: $id){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}": types.ApiOrgRoleIdDocument,
    "query apiOrgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,displayName,email\n          }\n        }\n      }\n    }\n  }\n}": types.ApiOrgUserListDocument,
    "query apiUserIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on User{\n      id,displayName\n    }\n  }\n}": types.ApiUserIdListDocument,
    "query apiUserId($id:GID!){\n  node(id: $id){\n    ... on User{\n      id,displayName\n    }\n  }\n}": types.ApiUserIdDocument,
    "query apiUserPermissionList($where: AppActionWhereInput){\n  userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}": types.ApiUserPermissionListDocument,
    "query layoutPkgUserMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,name,route,appID,parentID,displaySort,kind\n  }\n}": types.LayoutPkgUserMenuListDocument,
    "query layoutPkgUserRootOrgs($first:Int){\n  userRootOrgs{\n    id,\n    apps(first: $first){\n      totalCount,\n      edges{ node{ id,name,code } }\n    }\n  }\n}": types.LayoutPkgUserRootOrgsDocument,
    "query layoutPkgUserPreference{\n  orgUserPreference{\n    id,menuFavorite,menuRecent,\n  }\n}": types.LayoutPkgUserPreferenceDocument,
    "mutation layoutPkgSaveUserPreference($input:OrgUserPreferenceInput!){\n  saveOrgUserPreference(input: $input){ id }\n}": types.LayoutPkgSaveUserPreferenceDocument,
    "query userMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}": types.UserMenuListDocument,
    "query userRootOrgs{\n  userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}": types.UserRootOrgsDocument,
    "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,comments,status\n          }\n        }\n      }\n    }\n  }\n}": types.OrgAppListDocument,
    "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,comments,status\n      }\n    }\n  }\n}": types.AppListDocument,
    "query orgPkgAppInfo($gid: GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,comments,status\n    }\n  }\n}": types.OrgPkgAppInfoDocument,
    "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,ownerID,parentID,kind,profile,\n            domain,code,name,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.AppOrgListDocument,
    "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,ownerID,parentID,kind,profile,\n        domain,code,name,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}": types.OrgListDocument,
    "query orgPkgOrgInfo($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id,name,code,kind\n    }\n  }\n}": types.OrgPkgOrgInfoDocument,
    "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.UserListDocument,
    "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListDocument,
    "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRoleUserListDocument,
    "query orgPkgUserInfo($gid: GID!){\n  node(id:$gid){\n    ... on User{\n      id,displayName,email,mobile\n    }\n  }\n}": types.OrgPkgUserInfoDocument,
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
export function gql(source: "query apiAppIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on App{\n      id,code,name\n    }\n  }\n}"): (typeof documents)["query apiAppIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on App{\n      id,code,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiAppId($id:GID!){\n  node(id: $id){\n    ... on App{\n      id,code,name\n    }\n  }\n}"): (typeof documents)["query apiAppId($id:GID!){\n  node(id: $id){\n    ... on App{\n      id,code,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on Org{\n      id,code,name\n    }\n  }\n}"): (typeof documents)["query apiOrgIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on Org{\n      id,code,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgId($id:GID!){\n  node(id: $id){\n    ... on Org{\n      id,code,name\n    }\n  }\n}"): (typeof documents)["query apiOrgId($id:GID!){\n  node(id: $id){\n    ... on Org{\n      id,code,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,orgID,kind,name,comments\n      }\n    }\n  }\n}"): (typeof documents)["query apiOrgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,orgID,kind,name,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgRoleIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}"): (typeof documents)["query apiOrgRoleIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgRoleId($id:GID!){\n  node(id: $id){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}"): (typeof documents)["query apiOrgRoleId($id:GID!){\n  node(id: $id){\n    ... on OrgRole{\n      id,orgID,kind,name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiOrgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,displayName,email\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query apiOrgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,displayName,email\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiUserIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on User{\n      id,displayName\n    }\n  }\n}"): (typeof documents)["query apiUserIdList($ids:[GID!]!){\n  nodes(ids: $ids){\n    ... on User{\n      id,displayName\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiUserId($id:GID!){\n  node(id: $id){\n    ... on User{\n      id,displayName\n    }\n  }\n}"): (typeof documents)["query apiUserId($id:GID!){\n  node(id: $id){\n    ... on User{\n      id,displayName\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query apiUserPermissionList($where: AppActionWhereInput){\n  userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}"): (typeof documents)["query apiUserPermissionList($where: AppActionWhereInput){\n  userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query layoutPkgUserMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,name,route,appID,parentID,displaySort,kind\n  }\n}"): (typeof documents)["query layoutPkgUserMenuList($appCode:String!){\n  userMenus(appCode: $appCode){\n    id,name,route,appID,parentID,displaySort,kind\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query layoutPkgUserRootOrgs($first:Int){\n  userRootOrgs{\n    id,\n    apps(first: $first){\n      totalCount,\n      edges{ node{ id,name,code } }\n    }\n  }\n}"): (typeof documents)["query layoutPkgUserRootOrgs($first:Int){\n  userRootOrgs{\n    id,\n    apps(first: $first){\n      totalCount,\n      edges{ node{ id,name,code } }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query layoutPkgUserPreference{\n  orgUserPreference{\n    id,menuFavorite,menuRecent,\n  }\n}"): (typeof documents)["query layoutPkgUserPreference{\n  orgUserPreference{\n    id,menuFavorite,menuRecent,\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation layoutPkgSaveUserPreference($input:OrgUserPreferenceInput!){\n  saveOrgUserPreference(input: $input){ id }\n}"): (typeof documents)["mutation layoutPkgSaveUserPreference($input:OrgUserPreferenceInput!){\n  saveOrgUserPreference(input: $input){ id }\n}"];
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
export function gql(source: "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,comments,status\n      }\n    }\n  }\n}"): (typeof documents)["query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,comments,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPkgAppInfo($gid: GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,comments,status\n    }\n  }\n}"): (typeof documents)["query orgPkgAppInfo($gid: GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,comments,status\n    }\n  }\n}"];
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
export function gql(source: "query orgPkgOrgInfo($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id,name,code,kind\n    }\n  }\n}"): (typeof documents)["query orgPkgOrgInfo($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id,name,code,kind\n    }\n  }\n}"];
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
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPkgUserInfo($gid: GID!){\n  node(id:$gid){\n    ... on User{\n      id,displayName,email,mobile\n    }\n  }\n}"): (typeof documents)["query orgPkgUserInfo($gid: GID!){\n  node(id:$gid){\n    ... on User{\n      id,displayName,email,mobile\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;