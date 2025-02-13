import { App, AppMenuKind } from "@knockout-js/api/ucenter";

const apps: App[] = [
  { id: '1', name: 'app1', code: 'app1' },
  { id: '2', name: 'app2', code: 'app2-code' },
  { id: '3', name: 'app3', code: 'app3-code' },
  { id: '4', name: 'app4', code: 'app4-code' },
  { id: '5', name: 'app5', code: 'app5-code' },
  { id: '6', name: 'app6', code: 'app6-code' },
  { id: '7', name: 'app7', code: 'app7-code' },
]

const menuData = (appId: number | string, max: number, app: App) => {
  const data: {
    id: string
    name: string
    route: string
    appID: number | string
    kind: AppMenuKind
    app: App
  }[] = [];
  for (let i = 0; i < max; i++) {
    data.push(
      {
        id: `${appId}${i + 1}`,
        name: `app${appId}-menu${i + 1}`,
        route: `/${i}`,
        appID: appId,
        kind: AppMenuKind.Menu,
        app: app,
      }
    )
  }
  return data;
}
export const aggregateMenuDataSource = [
  {
    app: apps[0],
    menu: menuData(1, 8, apps[0])
  },
  {
    app: apps[1],
    menu: menuData(2, 4, apps[1])
  },
  {
    app: apps[2],
    menu: menuData(3, 18, apps[2])
  },
  {
    app: apps[3],
    menu: menuData(4, 14, apps[3])
  },
  {
    app: apps[4],
    menu: menuData(5, 8, apps[4])
  },
  {
    app: apps[5],
    menu: menuData(6, 10, apps[5])
  },
  {
    app: apps[6],
    menu: []
  },
];
