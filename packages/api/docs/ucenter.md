---
sidebar_position: 1
---
# ucenter 接口

## ucenter
提供ucenter相关接口

### getApps

根据应用id列表获取应用id、code、name,接口策略为`cache-first`

**参数：**

appIds: (string | number)[]

```ts
import { getApps } from '@knockout-js/api';

const apps = await getApps([1,2,3]) // 结果:App[]
```

### getApp

根据应用id获取应用id、code、name,接口策略为`cache-first`

**参数：**

appId: (string | number)

```ts
import { getApp } from '@knockout-js/api';

const app = await getApp(1) // 结果:App
```

### getOrgs

根据组织id列表获取组织id、code、name,接口策略为`cache-first`

**参数：**

orgIds: (string | number)[]

```ts
import { getOrgs } from '@knockout-js/api';

const orgs = await getOrgs([1,2,3]) // 结果:Org[]
```

### getOrg

根据组织id获取组织id、code、name,接口策略为`cache-first`

**参数：**

orgId: (string | number)

```ts
import { getOrg } from '@knockout-js/api';

const org = await getOrg(1) // 结果:Org
```

### getOrgGroupList

获取用户组列表

**参数：**

gather: {
  current?: number;
  pageSize?: number;
  where?: OrgRoleWhereInput;
  orderBy?: OrgRoleOrder;
}

```ts
import { getOrgGroupList } from '@knockout-js/api';

const orgGroups = await getOrgGroupList({
  current:1,
  pageSize:10,
}) // 结果:OrgRoleConnection
```

### getOrgRoles

根据组织角色id列表获取组织角色id、orgID、kind、name,接口策略为`cache-first`

**参数：**

orgRoleIds: (string | number)[]

```ts
import { getOrgRoles } from '@knockout-js/api';

const orgRoles = await getOrgRoles([1,2,3]) // 结果:OrgRole[]
```

### getOrgRole

根据组织角色id获取组织角色id、orgID、kind、name,接口策略为`cache-first`

**参数：**

orgRoleId: (string | number)

```ts
import { getOrgRole } from '@knockout-js/api';

const orgRole = await getOrgRole(1) // 结果:OrgRole
```

### getOrgUserList

获取组织下用户组列表

**参数：**

orgId: string,

gather: {
  current?: number;
  pageSize?: number;
  where?: UserWhereInput;
  orderBy?: UserOrder;
}

```ts
import { getOrgUserList } from '@knockout-js/api';

const orgGroups = await getOrgUserList(1,{
  current:1,
  pageSize:10,
}) // 结果:UserConnection
```

### userPermissions

根据应用code获取应用权限列表,接口策略为`cache-first`

**参数:**

appCode: string, 

headers?:Record<string,any>

```ts
import { userPermissions } from '@knockout-js/api';

const appActions = await userPermissions('appCode') // 结果:AppAction[]
```

### getUsers

根据用户id列表获取用户id,displayName,接口策略为`cache-first`

**参数:**

userIds: (string | number)[]

```ts
import { getUsers } from '@knockout-js/api';

const users = await getUsers([1,2,3]) // 结果:User[]
```

### getUser

根据用户id获取用户id,displayName,接口策略为`cache-first`

**参数:**

userId: (string | number)

```ts
import { getUser } from '@knockout-js/api';

const user = await getUser(1) // 结果:User
```
