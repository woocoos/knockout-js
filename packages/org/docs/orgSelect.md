---
sidebar_label: OrgSelect
---

本 Demo 演示用法

```tsx preview
import { OrgSelect } from "@knockout-js/org";
import { useState } from "react";
import { OrgKind } from "@knockout-js/api";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';

createUrqlInstance([
  {
    instanceName: 'default',
    url: 'http://127.0.0.1:3001/mock-api-adminx/graphql/query',
  }
])

export default () => {
  const [org, setOrg] = useState(),
    [orgId, setOrgId] = useState(),
    dataSource  = [
      {id:"dataSource1",name:'dataSource1org'}
    ];

  return <>
    <h4>普通场景：</h4>
    <OrgSelect value={org} onChange={setOrg} kind={OrgKind.Root}/>
    <div />
    <br/>
    <h4>value值是id=1：</h4>
    <OrgSelect value={"1"} />
     <div />
    <br/>
    <h4>value值是id=dataSource1，通过dataSource初始化：</h4>
    <OrgSelect value={"dataSource1"} dataSource={dataSource} />
    <div />
    <br/>
    <h4>返回值是ID：{orgId}</h4>
    <OrgSelect changeValue="id" onChange={setOrgId} />
  </>;
};
```

## props

| 属性          | 描述                                                          | 类型                             | 必填 | 默认值 |
| ------------- | ------------------------------------------------------------- | -------------------------------- | ---- | ------ |
| value         | 值可使用整个Opp对象或id作为值                                 | Org     &#124; Org['id']         | ❌    | -      |
| disabled      | 禁用                                                          | boolean                          | ❌    | -      |
| orgId         | 根据orgId过滤pathHasPrefix                                    | string                           | ❌    | -      |
| appId         | appId授权的组织列表                                           | string                           | ❌    | -      |
| kind          | 类型                                                          | OrgKind                          | ✅    | -      |
| searchProps   | [参考](https://ant.design/components/input-cn#api)            | SearchProps                      | ❌    | -      |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps                       | ❌    | -      |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps                    | ❌    | -      |
| dataSource    | 外部数据源提供应用列表配合value是id的时候初始化数据           | Org[]                            | ❌    | -      |
| changeValue   | 会改变onChange的第一个参数的值                                | keyof Org                        | ❌    | -      |
| onChange      | changeValue=id时value的值为id，默认value是Org                 | (value?:any,original?:App)=>void | ❌    | -      |
