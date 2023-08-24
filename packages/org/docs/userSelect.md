---
sidebar_label: UserSelect
---

本 Demo 演示用法

```tsx preview
import { UserSelect } from "@knockout-js/org";
import { useState } from "react";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';

createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

export default () => {
  const [user, setUser] = useState(),
    [userId, setUserId] = useState(),
    dataSource  = [
      {id:"dataSource1",displayName:'dataSource1user'}
    ];

  return  <>
    <h4>普通场景：</h4>
    <UserSelect value={user} onChange={setUser}/>
    <div />
    <br/>
    <h4>value值是id=1：</h4>
    <UserSelect value={"1"} />
    <div />
    <br/>
    <h4>value值是id=dataSource1，通过dataSource初始化：</h4>
    <UserSelect value={"dataSource1"} dataSource={dataSource} />
    <div />
    <br/>
    <h4>返回值是ID：{userId}</h4>
    <UserSelect changeValue="id" onChange={setUserId} />
  </>
};
```

## Props

| 属性          | 描述                                                          | 类型                              | 必填 | 默认值 |
| ------------- | ------------------------------------------------------------- | --------------------------------- | ---- | ------ |
| value         | 值可使用整个User对象或id作为值                                | User &#124; User['id']            | -    | -      |
| disabled      | 禁用                                                          | boolean                           | -    | -      |
| orgId         | orgId的用户                                                   | string                            | -    | -      |
| orgRoleId     | orgRoleId的用户                                               | string                            | -    | -      |
| userType      | 过滤用户类型                                                  | UserUserType                      | -    | -      |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps                       | -    | -      |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps                        | -    | -      |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps                     | -    | -      |
| dataSource    | 外部数据源提供应用列表配合value是id的时候初始化数据           | User[]                            | ❌    | -      |
| changeValue   | 会改变onChange的第一个参数的值                                | keyof User                        | ❌    | -      |
| onChange      | changeValue=id时value的值为id，默认value是User                | (value?:any,original?:User)=>void | -    | -      |
