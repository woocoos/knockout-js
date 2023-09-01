import { CloseOutlined, DragOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons"
import { useCallback, useEffect, useState } from "react"
import styles from "./index.module.css"
import { Drawer, Empty, Input, Space } from "antd";
import { gql, paging, query } from "@knockout-js/ice-urql/request";
import { App, AppMenu, AppMenuKind, LayoutPkgUserRootOrgsQuery, LayoutPkgUserRootOrgsQueryVariables, UserMenuListQuery, UserMenuListQueryVariables } from "@knockout-js/api";
import { iceUrqlInstance } from "..";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useLocale } from "../locale";
import { useDark, useTenantId } from "../provider";

const userMenuListQuery = gql(/* GraphQL */`query userMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,name,route,appID,parentID,displaySort,kind
  }
}`);

const userOrgAppsQuery = gql(/* GraphQL */`query layoutPkgUserRootOrgs($first:Int){
  userRootOrgs{
    id,
    apps(first: $first){
      totalCount,
      edges{ node{ id,name,code } }
    }
  }
}`);

export type AggregateMenuLocale = {
  title: string;
  latelyTitle: string;
  notText: string;
  searchPlaceholder: string;
}

export type AggregateMenuDataSource = {
  app: App;
  menu: AppMenu[];
}[]

export interface AggregateMenuProps {
  /**
   * 弹出开关
   */
  open?: boolean;
  /**
   * 数据源
   */
  dataSource?: AggregateMenuDataSource;
  /**
   * 弹出开关变更
   */
  onChangeOpen?: (open: boolean) => void;
  /**
   * 选中菜单
   */
  onClick?: (menuItem: AppMenu, app: App) => void;
}

/**
 * 排序拖拽使用的控件
 * https://docs.dndkit.com/
 * @param props
 * @returns
 */
const DargItem = (props: {
  value: AppMenu;
  onDel: () => void;
  onClick: () => void;
}) => {
  const id = `${props.value.id}-${props.value.appID}`;
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    className={styles.aggregateMenuDrawerMenuItem}
    onClick={() => {
      props.onClick();
    }}
  >
    <div className={styles.aggregateMenuDrawerMenuItemName}>{props.value.name}</div>
    <div className={styles.aggregateMenuDrawerMenuItemIcons}>
      <Space>
        <CloseOutlined rev={undefined} onClick={() => {
          props.onDel();
        }} />
        <DragOutlined rev={undefined}  {...listeners} className="dragIcon" />
      </Space>
    </div>
  </div>
}

export default (props: AggregateMenuProps) => {
  const [all, setAll] = useState<AggregateMenuDataSource>([]),
    [filterList, setFilterList] = useState<AggregateMenuDataSource>([]),
    [collects, setCollects] = useState<AppMenu[]>([]),
    [latelys, setLately] = useState<AppMenu[]>([]),
    locale = useLocale('AggregateMenu'),
    isDark = useDark(),
    tenantId = useTenantId(),
    sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

  const
    request = useCallback(async () => {
      const appsResult = await paging<LayoutPkgUserRootOrgsQuery, LayoutPkgUserRootOrgsQueryVariables>(userOrgAppsQuery, {
        first: 30,
      }, 1, { instanceName: iceUrqlInstance.ucenter }), apps: App[] = [];
      if (appsResult.data?.userRootOrgs) {
        appsResult.data.userRootOrgs.forEach(org => {
          if (tenantId === org.id) {
            org.apps.edges?.forEach(oApp => {
              if (oApp?.node && !apps.find(app => app.id === oApp.node?.id)) {
                apps.push(oApp.node as App);
              }
            })
          }
        })
      }
      const newAll: AggregateMenuDataSource = [];
      for (let i in apps) {
        const menuResult = await query<UserMenuListQuery, UserMenuListQueryVariables>(userMenuListQuery, {
          appCode: apps[i].code,
        }, { instanceName: iceUrqlInstance.ucenter });
        if (menuResult.data?.userMenus) {
          const menu = menuResult.data.userMenus as AppMenu[];
          newAll.push({
            app: apps[i],
            menu,
          })
        }
      }
      setAll(newAll);
      setFilterList(newAll);
    }, []),
    checkCollect = useCallback((menuItem: AppMenu) => {
      return !!collects.find(item => item.id === menuItem.id && item.appID === menuItem.appID);
    }, [collects]),
    menuItemRender = (menuItem: AppMenu) => {
      return <div
        key={`${menuItem.id}-${menuItem.appID}`}
        className={styles.aggregateMenuDrawerAllMenuItem}
        onClick={() => {
          const allApp = all.find(allItem => allItem.app.id == menuItem.appID);
          if (allApp) {
            props.onClick?.(menuItem, allApp.app);
          }
        }}
      >
        <div className={styles.aggregateMenuDrawerAllMenuItemName}> {menuItem.name}</div>
        <div>
          <StarOutlined rev={undefined} className={checkCollect(menuItem) ? 'collect' : ''} onClick={(event) => {
            event.stopPropagation();
            if (checkCollect(menuItem)) {
              setCollects(collects.filter(c => !(c.id === menuItem.id && c.appID === menuItem.appID)));
            } else {
              setCollects([...collects, menuItem]);
            }
          }} />
        </div>
      </div>
    }

  useEffect(() => {
    if (props.dataSource) {
      setAll(props.dataSource);
      setFilterList(props.dataSource);
    } else {
      request();
    }
  }, [props.dataSource]);

  return <>
    <Drawer
      className={`${styles.aggregateMenuDrawer} ${isDark ? styles.aggregateMenuDark : ''}`}
      title={locale.title}
      placement="left"
      open={props.open}
      width={1060}
      onClose={() => {
        props.onChangeOpen?.(false);
      }}
    >
      <div className={styles.aggregateMenuDrawerRow}>
        <div style={{ width: 240 }} className={styles.aggregateMenuDrawerMenu}>
          {collects.length ?
            <DndContext sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  setCollects((items) => {
                    const oldIndex = items.findIndex(oItem => `${oItem.id}-${oItem.appID}` == active.id);
                    const newIndex = items.findIndex(nItem => `${nItem.id}-${nItem.appID}` == over.id);
                    return arrayMove(items, oldIndex, newIndex);
                  });
                }
              }}
            >
              <SortableContext items={collects.map(item => `${item.id}-${item.appID}`)} strategy={verticalListSortingStrategy}>
                {
                  collects.map(item => (<DargItem
                    key={`c${item.id}-${item.appID}`}
                    value={item}
                    onDel={() => {
                      setCollects(collects.filter(c => !(c.id === item.id && c.appID === item.appID)));
                    }}
                    onClick={() => {
                      const allApp = all.find(allItem => allItem.app.id == item.appID);
                      if (allApp) {
                        props.onClick?.(item, allApp.app);
                      }
                    }}
                  />))
                }
              </SortableContext>
            </DndContext>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={locale.notText} />
          }
        </div>
        <div style={{ width: 820 }}>
          <div className={styles.aggregateMenuDrawerAllInput}>
            <Input
              bordered={false}
              prefix={<SearchOutlined rev={undefined} />}
              placeholder={locale.searchPlaceholder}
              onChange={(event) => {
                const keyword = event.target.value;
                if (keyword) {
                  const fList = all.map(f => {
                    return {
                      app: f.app,
                      menu: f.menu.filter(fMenuItem => fMenuItem.name.indexOf(keyword) > -1),
                    };
                  }).filter(f => f.menu.length);
                  setFilterList(fList);
                } else {
                  setFilterList([...all]);
                }
              }}
            />
          </div>
          {latelys.length ?
            <div className={styles.aggregateMenuLatelys}>
              <div className={styles.aggregateMenuDrawerAllMenuItemDir}>{locale.latelyTitle}</div>
              <div className={styles.aggregateMenuLatelysColumn}>
                {latelys.map(menuItem => (
                  menuItemRender(menuItem)
                ))}
              </div>
            </div> : <></>
          }
          <div className={styles.aggregateMenuDrawerAllMenu} style={{ height: latelys.length ? "calc(100% - 164px)" : "calc(100% - 52px)" }}>
            {filterList.map(item => (
              <div key={item.app.code} className={styles.aggregateMenuDrawerAllMenuColumn}>
                <div className={styles.aggregateMenuDrawerAllAppTitle}>{item.app.name}</div>
                {item.menu.map(menuItem => (menuItem.kind === AppMenuKind.Menu ?
                  menuItemRender(menuItem)
                  : <div
                    key={`${menuItem.appID}-${menuItem.id}`}
                    className={styles.aggregateMenuDrawerAllMenuItemDir}
                  >
                    {menuItem.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  </>
}
