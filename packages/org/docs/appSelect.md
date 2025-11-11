---
sidebar_label: AppSelect
---

本 Demo 演示用法


```tsx preview
import { AppSelect } from "@knockout-js/org";
import { useState } from "react";
import { createUrqlInstance } from '@knockout-js/ice-urql/request';
import { adminxApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: 'default',
    url: adminxApi,
  }
])

export default () => {
  const [app, setApp] = useState(),
    [appId, setAppId] = useState(),
    dataSource  = [
      {id:"dataSource1",name:'dataSource1App'}
    ];

  return <>
    <h4>普通场景：</h4>
    <AppSelect value={app} onChange={setApp}/>
    <div />
    <br/>
    <h4>value值是id=1：</h4>
    <AppSelect value={"1"} />
    <div />
    <br/>
    <h4>value值是id=dataSource1，通过dataSource初始化：</h4>
    <AppSelect value={"dataSource1"} dataSource={dataSource} />
    <div />
    <br/>
    <h4>返回值是ID：{appId}</h4>
    <AppSelect changeValue="id" onChange={setAppId} />
  </>;
};
```

## Props

| 属性          | 描述                                                          | 类型                             | 必填 | 默认值 |
| ------------- | ------------------------------------------------------------- | -------------------------------- | ---- | ------ |
| value         | 值可使用整个App对象或id作为值                                 | App  &#124; App['id']            | ❌    | -      |
| disabled      | 禁用                                                          | boolean                          | ❌    | -      |
| orgId         | orgId授权的应用                                               | string                           | ❌    | -      |
| where         | 查询条件                                                      | AppWhereInput                    | ❌    | -      |
| suffix        | 禁用时替换search的显示位置                                                      | ReactNode                        | ❌    | -      |
| inputProps    | [参考](https://ant.design/components/input-cn#api)            | InputProps                       | ❌    | -      |
| modalProps    | [参考](https://ant.design/components/modal-cn#api)            | ModalProps                       | ❌    | -      |
| proTableProps | [参考](https://procomponents.ant.design/components/table#api) | ProTableProps                    | ❌    | -      |
| dataSource    | 外部数据源提供应用列表配合value是id的时候初始化数据           | App[]                            | ❌    | -      |
| changeValue   | 会改变onChange的第一个参数的值                                | keyof App                        | ❌    | -      |
| onChange      | changeValue=id时value的值为id，默认value是App                 | (value?:any,original?:App)=>void | ❌    | -      |
