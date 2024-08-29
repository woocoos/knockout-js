---
sidebar_position: 1
---
# ucenter 接口

提供ucenter相关接口

使用用例

```tsx title=app.ts
import { getApps } from "@knockout-js/api";

const apps = await getApps([1])
```

## getApps

根据应用id列表获取应用id、code、name,接口策略为`cache-first`

```ts
function getApps(appIds: (string | number)[]): Promise<App[]>
```


## getApp

根据应用id获取应用id、code、name,接口策略为`cache-first`

```ts
function getApp(appId: (string | number)): Promise<{
    __typename?: "App" | undefined;
    id: string;
    code: string;
    name: string;
} | null>
```


## getOrgs

根据组织id列表获取组织id、code、name,接口策略为`cache-first`

```ts
function getOrgs(orgIds: (string | number)[]): Promise<Org[]>
```

## getOrg

根据组织id获取组织id、code、name,接口策略为`cache-first`


```ts
function getOrg(orgId: (string | number)): Promise<{
    __typename?: "Org" | undefined;
    id: string;
    code?: string | null | undefined;
    name: string;
} | null>
```


## getOrgGroupList

获取用户组列表


```ts
function getOrgGroupList(gather: {
    current?: number;
    pageSize?: number;
    where?: OrgRoleWhereInput;
    orderBy?: OrgRoleOrder;
}): Promise<{
    __typename?: "OrgRoleConnection" | undefined;
    totalCount: number;
    pageInfo: {
        __typename?: "PageInfo" | undefined;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: any;
        endCursor?: any;
    };
    edges?: ({
        ...;
    } | null)[] | undefined;
} | null>
```


## getOrgRoles

根据组织角色id列表获取组织角色id、orgID、kind、name,接口策略为`cache-first`

```ts
function getOrgRoles(orgRoleIds: (string | number)[]): Promise<OrgRole[]>
```


## getOrgRole

根据组织角色id获取组织角色id、orgID、kind、name,接口策略为`cache-first`

```ts
function getOrgRole(orgRoleId: (string | number)): Promise<{
    __typename?: "OrgRole" | undefined;
    id: string;
    orgID?: string | null | undefined;
    kind: OrgRoleKind;
    name: string;
} | null>
```


## getOrgUserList

获取组织下用户组列表


```ts
function getOrgUserList(orgId: string, gather: {
    current?: number;
    pageSize?: number;
    where?: UserWhereInput;
    orderBy?: UserOrder;
}): Promise<{
    __typename?: "UserConnection" | undefined;
    totalCount: number;
    pageInfo: {
        __typename?: "PageInfo" | undefined;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: any;
        endCursor?: any;
    };
    edges?: ({
        ...;
    } | null)[] | undefined;
} | null>
```


## userPermissions

根据应用code获取应用权限列表,接口策略为`cache-first`

```ts
function userPermissions(appCode: string, headers?: Record<string, any>): Promise<{
    __typename?: "AppAction" | undefined;
    id: string;
    appID?: string | null | undefined;
    name: string;
    kind: AppActionKind;
    method: AppActionMethod;
}[] | null>
```


## getUsers

根据用户id列表获取用户id,displayName,接口策略为`cache-first`

```ts
function getUsers(userIds: (string | number)[]): Promise<User[]>
```

## getUser

根据用户id获取用户id,displayName,接口策略为`cache-first`

```ts
function getUser(userId: (string | number)): Promise<{
    __typename?: "User" | undefined;
    id: string;
    displayName: string;
} | null>
```

## getDictItems

根据refCode来获取字典项列表,接口策略为`cache-first`


```ts
function getDictItems(refCodes: string | string[], forceReload?: boolean): Promise<AppDictItem[]>:AppDictItem[]
```


## getFileIdentitieList

获取`FileIdentity`的分页接口

```ts
function getFileIdentitieList(gather: {
    current?: number;
    pageSize?: number;
    where?: FileIdentityWhereInput;
    orderBy?: FileIdentityOrder;
}): Promise<{
    __typename?: "FileIdentityConnection";
    totalCount: number;
    pageInfo: {
        __typename?: "PageInfo";
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: any | null;
        endCursor?: any | null;
    };
    edges?: Array<{
        __typename?: "FileIdentityEdge";
        node?: {
            __typename?: "FileIdentity";
            id: string;
            isDefault: boolean;
            tenantID: string;
            source: {
                __typename?: "FileSource";
                id: string;
                bucket: string;
                region: string;
                kind: FileSourceKind;
                endpoint: string;
                endpointImmutable: boolean;
                stsEndpoint: string;
                bucketURL: string;
            };
        } | null;
    } | null> | null;
} | undefined>
```

## getFileSource

获取当前组织的文件数据源，可配合awsS3操作使用,接口策略为`cache-first`

```ts
function getFileSource(filter?: {
    bucket: string;
    endpoint: string;
}): Promise<{
    __typename?: "FileIdentity";
    id: string;
    isDefault: boolean;
    tenantID: string;
    source: {
        __typename?: "FileSource";
        id: string;
        bucket: string;
        region: string;
        kind: FileSourceKind;
        endpoint: string;
        stsEndpoint: string;
        bucketurl?: string | null;
    };
} | null | undefined>
```

