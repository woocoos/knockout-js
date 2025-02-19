---
sidebar_label: AggregateMenu
---

本 Demo 演示用法。

```tsx preview
import { AggregateMenu,CollectProviders } from "@knockout-js/layout";
import { useState } from "react";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { Button,Space } from "antd";
import { App, AppMenu, AppMenuKind } from "@knockout-js/api/ucenter";
import { adminxApi } from "./assets/api";
import "./assets/test.css";

createUrqlInstance([
  {
    instanceName: "default",
    url: adminxApi,
  },
]);

export default () => {
  const [open,setOpen] = useState(false);
  const [darkOpen,setDarkOpen] = useState(false);
 
  const menuData = (appId,max,app) => {
    const data = [];
    for(let i =0;i<max;i++){
      data.push(
         { 
          id: `${appId}${i+1}`, name: `app${appId}-menu${i+1}`, route: `/${i}`, appID: appId,kind:AppMenuKind.Menu ,
          app: app,
        }
      )
    }
    return data;
  }

  const apps:App[] = [
    { id: '1', name: 'app1', code: 'app1' },
    { id: '2', name: 'app2', code: 'app2-code' },
    { id: '3', name: 'app3', code: 'app3-code' },
    { id: '4', name: 'app4', code: 'app4-code' },
    { id: '5', name: 'app5', code: 'app5-code' },
    { id: '6', name: 'app6', code: 'app6-code' },
    { id: '7', name: 'app7', code: 'app7-code' },
  ]
  const dataSource = [
    {
      app: apps[0] ,
      menu: menuData(1,8,apps[0])
    },
    {
      app: apps[1],
      menu:menuData(2,4,apps[1])
    },
    {
      app: apps[2],
      menu:menuData(3,18,apps[2])
    },
    {
      app: apps[3],
      menu:menuData(4,14,apps[3])
    },
    {
      app: apps[4],
      menu: menuData(5,8,apps[4])
    },
    {
      app: apps[5],
      menu:menuData(6,10,apps[5])
    },
    {
      app: apps[6],
      menu:[]
    },
  ];


  return (
    <div >
      <Space>
      <Button onClick={()=> {setOpen(!open)}}>显示</Button>
      <Button onClick={()=> {setDarkOpen(!darkOpen)}}>显示黑色主题</Button>
      </Space>
      <CollectProviders tenantId="1">
        <AggregateMenu
          open={open}
          dataSource={dataSource}
          onChangeOpen={setOpen}
          onClick={(menuIten,app) => {
            console.log(menuIten,app)
          }}
        />
      </CollectProviders>
      <CollectProviders tenantId="1" dark={true}>
        <AggregateMenu
          open={darkOpen}
          dataSource={dataSource}
          onChangeOpen={setDarkOpen}
          onClick={(menuIten,app) => {
            console.log(menuIten,app)
          }}
        />
      </CollectProviders>
    </div>
  );
};
```


## props

| 属性         | 描述             | 类型                                                    | 必填 | 默认值 |
| ------------ | ---------------- | ------------------------------------------------------- | ---- | ------ |
| open         | 打开弹出框       | boolean                                                 | ❌    | -      |
| dataSource   | 数据源           | AggregateMenuDataSource                                 | ❌    | -      |
| drawerProps  | ant组件的        | DrawerProps                                             | ❌    | -      |
| onChangeOpen | 弹出开关变更事件 | (open: boolean) => void;                                | ❌    | -      |
| onClick      | 选中菜单         | (menuItem: AppMenu, app: App, isOpen?:boolean) => void; | ❌    | -      |
