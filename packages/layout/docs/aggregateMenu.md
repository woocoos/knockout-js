---
sidebar_label: AggregateMenu
---

本 Demo 演示用法。

```tsx preview
import { AggregateMenu,Provider } from "@knockout-js/layout";
import { useState } from "react";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { Button } from "antd";
import { App, AppMenu, AppMenuKind } from "@knockout-js/api/ucenter";
import { adminxApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: "default",
    url: adminxApi,
  },
]);

export default () => {
  const [open,setOpen] = useState(false);
 
  const menuData = (appId,max) => {
    const data = [];
    for(let i =0;i<max;i++){
      data.push(
         { id: `${appId}${i+1}`, name: `app${appId}-menu${i+1}`, route: `/${i}`, appID: appId,kind:AppMenuKind.Menu }
      )
    }
    return data;
  }

  const dataSource = [
    {
      app: { id: '1', name: 'app1', code: 'app1' } as App,
      menu: menuData(1,8)
    },
    {
      app: { id: '2', name: 'app2', code: 'app2' } as App,
      menu:menuData(2,4)
    },
    {
      app: { id: '3', name: 'app3', code: 'app3' } as App,
      menu:menuData(3,18)
    },
    {
      app: { id: '4', name: 'app4', code: 'app4' } as App,
      menu:menuData(4,14)
    },
    {
      app: { id: '5', name: 'app5', code: 'app5' } as App,
      menu: menuData(5,8)
    },
    {
      app: { id: '6', name: 'app6', code: 'app6' } as App,
      menu:menuData(6,10)
    },
  ];


  return (
    <div >
      <Button onClick={()=> {setOpen(!open)}}>显示</Button>
      <Provider tenantId="1">
        <AggregateMenu
          open={open}
          dataSource={dataSource}
          onChangeOpen={setOpen}
          onClick={(menuIten,app) => {
            console.log(menuIten,app)
          }}
        />
      </Provider>
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
