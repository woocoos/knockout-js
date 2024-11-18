import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { instanceName } from "@knockout-js/api";
import { App, AppMenu, AppMenuKind, LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables, LayoutPkgUserAppListQuery, LayoutPkgUserAppListQueryVariables, LayoutPkgUserMenuListQuery, LayoutPkgUserMenuListQueryVariables, LayoutPkgUserPreferenceQuery, LayoutPkgUserPreferenceQueryVariables } from "@knockout-js/api/ucenter";
import { gql, mutation, paging, query } from "@knockout-js/ice-urql/request";
import { Drawer, DrawerProps, Empty, Input, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { listFormatTreeData, treeFormatList } from "../_util";
import { OpenWin } from "../icons";
import { useLocale } from "../locale";
import { useDark } from "../provider";
import styles from "./index.module.css";
import Collects from "./collects";
import { arrayMove } from "@dnd-kit/sortable";

const userMenuListQuery = gql(/* GraphQL */`query layoutPkgUserMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,name,route,appID,parentID,displaySort,kind,
    app{   id,name,code },
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

export type CollectsDataSource = {
  id: string;
  code: string;
  name: string;
  children: AppMenu[];
}

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

export default (props: AggregateMenuProps) => {
  const [all, setAll] = useState<AggregateMenuDataSource>([]),
    [filterList, setFilterList] = useState<AggregateMenuDataSource>([]),
    [collects, setCollects] = useState<CollectsDataSource[]>([]),
    [latelys, setLately] = useState<AppMenu[]>([]),
    locale = useLocale('AggregateMenu'),
    isDark = useDark();

  const
    request = useCallback(async () => {
      const appsResult = await paging<LayoutPkgUserAppListQuery, LayoutPkgUserAppListQueryVariables>(userAppsQuery, {}, 1, {
        instanceName: instanceName.UCENTER,
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
        }, { instanceName: instanceName.UCENTER });
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
      const preferenceResult = await query<LayoutPkgUserPreferenceQuery, LayoutPkgUserPreferenceQueryVariables>(userPreferenceQuery, {}, {
        instanceName: instanceName.UCENTER
      });
      if (preferenceResult.data?.orgUserPreference?.id) {
        const menuFavorite = preferenceResult.data.orgUserPreference.menuFavorite,
          menuRecent = preferenceResult.data.orgUserPreference.menuRecent,
          collectsList: CollectsDataSource[] = [],
          latelyList: AppMenu[] = [];
        if (menuFavorite) {
          menuFavorite.forEach(id => {
            for (let i in newAll) {
              const allItem = newAll[i];
              const menuItem = allItem.menu.find(item => item.id == id);
              if (menuItem) {
                const collectItem = collectsList.find(item => item.id == allItem.app.id);
                if (collectItem) {
                  collectItem.children.push(menuItem);
                } else {
                  collectsList.push({
                    id: allItem.app.id,
                    code: allItem.app.code,
                    name: allItem.app.name,
                    children: [menuItem]
                  });
                }
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
    saveFavorite = async (list: AppMenu[]) => {
      // 异步存储收藏
      await mutation<LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables>(userPreferenceMut, {
        input: {
          menuFavorite: list.map(item => item.id),
        }
      }, {
        instanceName: instanceName.UCENTER,
      });
    },
    saveRecentMenu = async (ids: string[]) => {
      // 异步存储访问菜单记录
      await mutation<LayoutPkgSaveUserPreferenceMutation, LayoutPkgSaveUserPreferenceMutationVariables>(userPreferenceMut, {
        input: {
          menuRecent: ids,
        }
      }, {
        instanceName: instanceName.UCENTER,
      });
    },
    // 是否已收藏
    checkCollect = useCallback((menuItem: AppMenu) => {
      const collectItem = collects.find(item => item.id === menuItem.appID);
      if (collectItem) {
        return !!collectItem.children.find(item => item.id === menuItem.id)
      } else {
        return false
      }
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
        await saveRecentMenu(latelyList.map(item => item.id));
        setLately(latelyList);
        props.onClick?.(menuItem, allApp.app, isOpen);
      }
    },
    // 移除或者添加收藏
    updateCollects = (menuItem: AppMenu, isRemove?: boolean) => {
      const collectItem = collects.find(item => item.id === menuItem.appID);
      if (collectItem) {
        if (isRemove) {
          collectItem.children = collectItem.children.filter(item => item.id !== menuItem.id);
          if (collectItem.children.length === 0) {
            collects.splice(collects.findIndex(item => item.id === collectItem.id), 1);
          }
        } else {
          collectItem.children.push(menuItem);
        }
      } else {
        if (!isRemove) {
          collects.push({
            id: menuItem.appID ?? '',
            code: menuItem.app?.code ?? '',
            name: menuItem.app?.name ?? '',
            children: [menuItem]
          });
        }
      }
      setCollects([...collects]);
      // 处理保存数据
      const saveFavoriteList: AppMenu[] = [];
      collects.forEach(item => {
        saveFavoriteList.push(...item.children)
      });
      saveFavorite(saveFavoriteList)
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
              const collectList: AppMenu[] = [];
              if (checkCollect(menuItem)) {
                updateCollects(menuItem, true)
              } else {
                updateCollects(menuItem)
              }
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
            <Collects
              dataSource={collects}
              onDragEnd={(event, type) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  setCollects((items) => {
                    let collectList: CollectsDataSource[] = []
                    if (type === 'app') {
                      const oldIndex = items.findIndex(oItem => oItem.id == active.id);
                      const newIndex = items.findIndex(nItem => nItem.id == over.id);
                      collectList = arrayMove(items, oldIndex, newIndex);
                    } else if (type === 'menu') {
                      const activeAppId = `${active.id}`.split('-')[0];
                      const activeItem = items.find(item => item.id == activeAppId);
                      if (activeItem) {
                        const oldIndex = activeItem.children.findIndex(oItem => `${activeAppId}-${oItem.id}` == active.id);
                        const newIndex = activeItem.children.findIndex(nItem => `${activeAppId}-${nItem.id}` == over.id);
                        activeItem.children = arrayMove(activeItem.children, oldIndex, newIndex);
                      }
                      collectList = [...items]
                    }
                    const saveFavoriteList: AppMenu[] = [];
                    collectList.forEach(item => {
                      saveFavoriteList.push(...item.children)
                    });
                    console.log(saveFavoriteList)
                    saveFavorite(saveFavoriteList)
                    return collectList;
                  });
                }
              }}
              onDel={async item => {
                updateCollects(item, true)
              }}
              onClick={(item, isOpen) => {
                onClickItem(item, isOpen)
              }}
            />
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
              {filterList.map(item => (item.menu.length ?
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
                : <></>))}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </>
}
