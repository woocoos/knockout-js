---
sidebar_label: GatherMenu
---

本 Demo 演示用法。

```tsx preview
import { GatherMenu } from "@knockout-js/layout";
import { useState } from "react";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { Button } from "antd";
import { App, AppMenu } from "@knockout-js/api";

createUrqlInstance([
  {
    instanceName: "default",
    url: "http://127.0.0.1:3001/mock-api-adminx/graphql/query",
  },
]);

export default () => {
  const [open,setOpen] = useState(false),
  dataSource = [
    {
      app: { id: '1', name: 'app1', code: 'app1' } as App,
      menu: [
        { id: '1', name: 'app1-menu1', route: '/0', appID: "1" } as AppMenu,
        { id: '2', name: 'app1-menu2', route: '/1', appID: "1" } as AppMenu,
      ]
    },
    {
      app: { id: '2', name: 'app2', code: 'app2' } as App,
      menu: [
        { id: '1', name: 'app2-menu1sdfsldjfklasjdfklsajdklfjalskdjfmenu1sdfsldjfklasjdfklsajdklfjalskdjf', route: '/1', appID: "2" } as AppMenu,
        { id: '2', name: 'app2-menu2', route: '/2', appID: "2" } as AppMenu,
        { id: '3', name: 'app2-menu3', route: '/3', appID: "2" } as AppMenu,
      ]
    },
    {
      app: { id: '3', name: 'app3', code: 'app3' } as App,
      menu: [
        { id: '1', name: 'app3-menu1', route: '/1', appID: "3" } as AppMenu,
        { id: '2', name: 'app3-menu2', route: '/2', appID: "3" } as AppMenu,
        { id: '3', name: 'app3-menu3', route: '/3', appID: "3" } as AppMenu,
      ]
    },
    {
      app: { id: '4', name: 'app4', code: 'app4' } as App,
      menu: [
        { id: '1', name: 'app4-menu1', route: '/1', appID: "4" } as AppMenu,
        { id: '2', name: 'app4-menu2', route: '/2', appID: "4" } as AppMenu,
        { id: '3', name: 'app4-menu3', route: '/3', appID: "4" } as AppMenu,
        { id: '4', name: 'app4-menu4', route: '/4', appID: "4" } as AppMenu,
      ]
    },
    {
      app: { id: '5', name: 'app5', code: 'app5' } as App,
      menu: [
        { id: '1', name: 'app5-menu1', route: '/0', appID: "5" } as AppMenu,
        { id: '2', name: 'app5-menu2', route: '/1', appID: "5" } as AppMenu,
      ]
    },
    {
      app: { id: '6', name: 'app6', code: 'app6' } as App,
      menu: [
        { id: '1', name: 'app6-menu1', route: '/0', appID: "6" } as AppMenu,
        { id: '2', name: 'app6-menu2', route: '/1', appID: "6" } as AppMenu,
      ]
    },
  ];

  return (
    <div >
      <Button onClick={()=> {setOpen(!open)}}>显示</Button>
      <GatherMenu
        open={open}
        storeKey="test-storeKey"
        dataSource={dataSource}
        onChangeOpen={setOpen}
        onClick={(menuIten,app) => {
          console.log(menuIten,app)
        }}
      />
    </div>
  );
};
```


## props

<!-- <ReactDocgenProps path="../src/components/gather-menu/index.tsx"></ReactDocgenProps> -->

| 属性         | 描述                             | 类型                                   | 必填 | 默认值 |
| ------------ | -------------------------------- | -------------------------------------- | ---- | ------ |
| open         | 打开弹出框                       | boolean                                | ❌    | -      |
| dataSource   | 数据源                           | GatherMenuDataSource                   | ❌    | -      |
| storeKey     | 有设置就会存储在`localStorage`中 | string                                 | ❌    | -      |
| onChangeOpen | 弹出开关变更事件                 | (open: boolean) => void;               | ❌    | -      |
| onClick      | 选中菜单                         | (menuItem: AppMenu, app: App) => void; | ❌    | -      |
