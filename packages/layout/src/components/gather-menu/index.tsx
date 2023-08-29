import { CloseOutlined, DragOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons"
import { useCallback, useEffect, useState } from "react"
import styles from "./index.module.css"
import { Col, Drawer, Empty, Input, Row, Space } from "antd";
import { gql, paging, query } from "@knockout-js/ice-urql/request";
import { App, AppMenu, LayoutPkgUserRootOrgsQuery, LayoutPkgUserRootOrgsQueryVariables, UserMenuListQuery, UserMenuListQueryVariables } from "@knockout-js/api";
import { iceUrqlInstance } from "..";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useLocale } from "../locale";

const userMenuListQuery = gql(/* GraphQL */`query userMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,name,route,appID
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

export type GatherMenuLocale = {
  notText: string;
  searchPlaceholder: string;
}

export type GatherMenuDataSource = {
  app: App;
  menu: AppMenu[];
}[]

export interface GatherMenuProps {
  /**
   * 弹出开关
   */
  open?: boolean;
  /**
   * 数据源
   */
  dataSource?: GatherMenuDataSource;
  /**
   * 存储key
   */
  storeKey?: string;
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
  const { setNodeRef, listeners, attributes, transform, transition, setDraggableNodeRef } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    className={styles.customMenuDrawerMenuItem}
    onClick={() => {
      props.onClick();
    }}
  >
    <div className={styles.customMenuDrawerMenuItemName}>{props.value.name}</div>
    <div className={styles.customMenuDrawerMenuItemIcons}>
      <Space>
        <CloseOutlined rev={undefined} onClick={() => {
          props.onDel();
        }} />
        <DragOutlined rev={undefined}  {...listeners} className="dragIcon" />
      </Space>
    </div>
  </div>
}

export default (props: GatherMenuProps) => {
  const [all, setAll] = useState<GatherMenuDataSource>([]),
    [filterList, setFilterList] = useState<GatherMenuDataSource>([]),
    [collects, setCollects] = useState<AppMenu[]>([]),
    locale = useLocale('GatherMenu'),
    sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  ;

  const
    request = useCallback(async () => {
      const appsResult = await paging<LayoutPkgUserRootOrgsQuery, LayoutPkgUserRootOrgsQueryVariables>(userOrgAppsQuery, {
        first: 30,
      }, 1, { instanceName: iceUrqlInstance.ucenter }), apps: App[] = [];
      if (appsResult.data?.userRootOrgs) {
        appsResult.data.userRootOrgs.forEach(org => {
          org.apps.edges?.forEach(oApp => {
            if (oApp?.node) {
              if (!apps.find(app => app.id === oApp.node?.id)) {
                apps.push(oApp.node as App);
              }
            }
          })
        })
      }
      const newAll: GatherMenuDataSource = [];
      for (let i in apps) {
        const menuResult = await query<UserMenuListQuery, UserMenuListQueryVariables>(userMenuListQuery, {
          appCode: apps[i].code,
        }, { instanceName: iceUrqlInstance.ucenter });
        if (menuResult.data?.userMenus) {
          const menu = menuResult.data.userMenus.filter(item => item.route) as AppMenu[];
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
    }, [collects])

  useEffect(() => {
    if (props.dataSource) {
      setAll(props.dataSource);
      setFilterList(props.dataSource);
    } else {
      request();
    }
  }, [props.dataSource]);

  useEffect(() => {
    if (props.storeKey) {
      const store = localStorage.getItem(props.storeKey);
      if (store) {
        try {
          setCollects(JSON.parse(store));
        } catch (error) {
        }
      }
    }
  }, [props.storeKey]);

  useEffect(() => {
    if (props.storeKey) {
      if (collects.length) {
        localStorage.setItem(props.storeKey, JSON.stringify(collects));
      } else {
        localStorage.removeItem(props.storeKey);
      }
    }
  }, [collects]);

  return <>
    <Drawer
      className={styles.customMenuDrawer}
      placement="left"
      open={props.open}
      width={1060}
      onClose={() => {
        props.onChangeOpen?.(false);
      }}
    >
      <div className={styles.customMenuDrawerRow}>
        <div style={{ width: 240 }} className={styles.customMenuDrawerMenu}>
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
          <div className={styles.customMenuDrawerAllInput}>
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
          <div className={styles.customMenuDrawerAllMenu}>
            {filterList.map(item => (
              <div key={item.app.code} className={styles.customMenuDrawerAllMenuColumn}>
                <div className={styles.customMenuDrawerAllMenuTitle}>{item.app.name}</div>
                {item.menu.map(menuItem => (
                  <div
                    key={`${menuItem.appID}-${menuItem.id}`}
                    className={styles.customMenuDrawerAllMenuItem}
                    onClick={() => {
                      props.onClick?.(menuItem, item.app);
                    }}
                  >
                    <div className={styles.customMenuDrawerAllMenuItemName}>{menuItem.name}</div>
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
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  </>
}
