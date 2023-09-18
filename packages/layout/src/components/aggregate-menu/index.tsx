import { CloseOutlined, DragOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons"
import { useCallback, useEffect, useState } from "react"
import styles from "./index.module.css"
import { Drawer, DrawerProps, Empty, Input, Space } from "antd";
import { gql, mutation, paging, query } from "@knockout-js/ice-urql/request";
import { iceUrqlInstance } from "..";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useLocale } from "../locale";
import { useDark } from "../provider";
import { listFormatTreeData, treeFormatList } from "../_util";
import { OpenWin } from "../icons";
import { App, AppMenu, AppMenuKind, LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables, LayoutPkgUserAppListQuery, LayoutPkgUserAppListQueryVariables, LayoutPkgUserMenuListQuery, LayoutPkgUserMenuListQueryVariables, LayoutPkgUserPreferenceQuery, LayoutPkgUserPreferenceQueryVariables } from "@knockout-js/api/esm/gql/ucenter/graphql";

const userMenuListQuery = gql(/* GraphQL */`query layoutPkgUserMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,name,route,appID,parentID,displaySort,kind
  }
}`);

const userAppsQuery = gql(/* GraphQL */`query layoutPkgUserAppList{
  userApps{
    id,name,code
  }
}`);

const userPreferenceQuery = gql(/* GraphQL */`query layoutPkgUserPreference{
  orgUserPreference{
    id,menuFavorite,menuRecent,
  }
}`);

const userPreferenceMut = gql(/* GraphQL */`mutation layoutPkgSaveUserPreference($input:OrgUserPreferenceInput!){
  saveOrgUserPreference(input: $input){ id }
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
   * 弹框设置
   */
  drawerProps?: DrawerProps;
  /**
   * 弹出开关变更
   */
  onChangeOpen?: (open: boolean) => void;
  /**
   * 选中菜单
   */
  onClick?: (menuItem: AppMenu, app: App, isOpen?: boolean) => void;
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
  onClick: (isOpen?: boolean) => void;
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
        <OpenWin className="anticon" onClick={(event) => {
          event.stopPropagation();
          props.onClick(true);
        }} />
        <CloseOutlined rev={undefined} onClick={(event) => {
          event.stopPropagation();
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
    sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

  const
    request = useCallback(async () => {
      const appsResult = await paging<LayoutPkgUserAppListQuery, LayoutPkgUserAppListQueryVariables>(userAppsQuery, {}, 1, {
        instanceName: iceUrqlInstance.ucenter
      }), apps: App[] = [];
      if (appsResult.data?.userApps) {
        appsResult.data.userApps.forEach(app => {
          apps.push(app as App)
        })
      }
      const newAll: AggregateMenuDataSource = [];
      for (let i in apps) {
        const menuResult = await query<LayoutPkgUserMenuListQuery, LayoutPkgUserMenuListQueryVariables>(userMenuListQuery, {
          appCode: apps[i].code,
        }, { instanceName: iceUrqlInstance.ucenter });
        if (menuResult.data?.userMenus) {
          const menu = menuResult.data.userMenus.sort((d1, d2) => {
            const d1Sort = d1.displaySort || 0, d2Sort = d2.displaySort || 0;
            return d1.parentID < d2.parentID ? -1 : d1.parentID > d2.parentID ? 1 : d1Sort < d2Sort ? -1 : d1Sort > d2Sort ? 1 : 0;
          }) as AppMenu[];
          newAll.push({
            app: apps[i],
            menu: treeFormatList(listFormatTreeData(menu, undefined, { key: 'id', parentId: 'parentID' })),
          })
        }
      }
      setAll(newAll);
      setFilterList(newAll);
      // 初始化收藏和初始化最近数据
      const preferenceResult = await query<LayoutPkgUserPreferenceQuery, LayoutPkgUserPreferenceQueryVariables>(userPreferenceQuery, {}, { instanceName: iceUrqlInstance.ucenter });
      if (preferenceResult.data?.orgUserPreference?.id) {
        const menuFavorite = preferenceResult.data.orgUserPreference.menuFavorite,
          menuRecent = preferenceResult.data.orgUserPreference.menuRecent,
          collectsList: AppMenu[] = [],
          latelyList: AppMenu[] = [];
        if (menuFavorite) {
          menuFavorite.forEach(id => {
            for (let i in newAll) {
              const menuItem = newAll[i].menu.find(item => item.id == id);
              if (menuItem) {
                collectsList.push(menuItem);
                break;
              }
            }

          })
        }
        if (menuRecent) {
          menuRecent.forEach(id => {
            for (let i in newAll) {
              const menuItem = newAll[i].menu.find(item => item.id == id);
              if (menuItem) {
                latelyList.push(menuItem);
                break;
              }
            }

          })
        }
        setCollects(collectsList);
        setLately(latelyList);
      }
    }, []),
    requestFavorite = async (list: AppMenu[]) => {
      // 异步存储收藏
      await mutation<LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables>(userPreferenceMut, {
        input: {
          menuFavorite: list.map(item => item.id),
        }
      }, {
        instanceName: iceUrqlInstance.ucenter
      });
    },
    requestRecent = async (ids: string[]) => {
      // 异步存储访问菜单记录
      await mutation<LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables>(userPreferenceMut, {
        input: {
          menuRecent: ids,
        }
      }, {
        instanceName: iceUrqlInstance.ucenter
      });
    },
    checkCollect = useCallback((menuItem: AppMenu) => {
      return !!collects.find(item => item.id === menuItem.id && item.appID === menuItem.appID);
    }, [collects]),
    onClickItem = async (menuItem: AppMenu, isOpen?: boolean) => {
      const allApp = all.find(allItem => allItem.app.id == menuItem.appID);
      if (allApp) {
        const latelyList = [...latelys];
        const oldIdx = latelyList.findIndex(lately => lately.id == menuItem.id);
        if (oldIdx > -1) {
          latelyList.splice(oldIdx, 1);
        }
        latelyList.unshift(menuItem);
        latelyList.splice(6);
        await requestRecent(latelyList.map(item => item.id));
        setLately(latelyList);
        props.onClick?.(menuItem, allApp.app, isOpen);
      }
    },
    menuItemRender = (menuItem: AppMenu) => {
      return <div
        key={`${menuItem.id}-${menuItem.appID}`}
        className={styles.aggregateMenuDrawerAllMenuItem}
        onClick={() => {
          onClickItem(menuItem)
        }}
      >
        <div className={styles.aggregateMenuDrawerAllMenuItemName}> {menuItem.name}</div>
        <div className={styles.aggregateMenuDrawerAllMenuItemIcons}>
          <Space>
            <OpenWin className="anticon" onClick={(event) => {
              event.stopPropagation();
              onClickItem(menuItem, true)
            }} />
            <StarOutlined rev={undefined} className={checkCollect(menuItem) ? 'collect' : ''} onClick={async (event) => {
              event.stopPropagation();
              let collectList: AppMenu[] = [];
              if (checkCollect(menuItem)) {
                collectList = collects.filter(c => !(c.id === menuItem.id && c.appID === menuItem.appID))
              } else {
                collectList = [...collects, menuItem]
              }
              await requestFavorite(collectList)
              setCollects(collectList);
            }} />
          </Space>
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
      title={locale.title}
      maskClosable={false}
      placement="left"
      width={1060}
      {...props.drawerProps}
      className={`${styles.aggregateMenuDrawer} ${isDark ? styles.aggregateMenuDark : ''}`}
      open={props.open}
      onClose={() => {
        props.onChangeOpen?.(false);
      }}
    >
      <div className={styles.aggregateMenuDrawerRow}>
        <div style={{ width: 240 }} className={styles.aggregateMenuDrawerMenu}>
          {/* 收藏 */}
          {collects.length ?
            <DndContext sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  setCollects((items) => {
                    const oldIndex = items.findIndex(oItem => `${oItem.id}-${oItem.appID}` == active.id);
                    const newIndex = items.findIndex(nItem => `${nItem.id}-${nItem.appID}` == over.id);
                    const collectList = arrayMove(items, oldIndex, newIndex);
                    requestFavorite(collectList);
                    return collectList;
                  });
                }
              }}
            >
              <SortableContext items={collects.map(item => `${item.id}-${item.appID}`)} strategy={verticalListSortingStrategy}>
                {
                  collects.map(item => (<DargItem
                    key={`c${item.id}-${item.appID}`}
                    value={item}
                    onDel={async () => {
                      const collectList = collects.filter(c => !(c.id === item.id && c.appID === item.appID))
                      await requestFavorite(collectList);
                      setCollects(collectList);
                    }}
                    onClick={(isOpen) => {
                      onClickItem(item, isOpen)
                    }}
                  />))
                }
              </SortableContext>
            </DndContext>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={locale.notText} />
          }
        </div>
        <div style={{ width: 820 }}>
          {/* 过滤 */}
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
          {/* 最近访问 */}
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
          {/* all应用菜单 */}
          <div className={styles.aggregateMenuDrawerAllMenu} style={{ height: latelys.length ? "calc(100% - 164px)" : "calc(100% - 52px)" }}>
            <div className={styles.aggregateMenuDrawerAllMenuColumn}>
              {filterList.map(item => (
                <div key={item.app.code} className={styles.aggregateMenuDrawerAllMenuColumnItem}>
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
      </div>
    </Drawer>
  </>
}
