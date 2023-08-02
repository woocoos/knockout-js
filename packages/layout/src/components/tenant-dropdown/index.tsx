import { Dropdown, MenuProps, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useLocale } from '../locale';
import { gql, useClient } from 'urql'
import { Org, UserRootOrgsQuery, UserRootOrgsQueryVariables } from '@knockout-js/api';

export interface TenantDropdownLocale {
  switchTipTitle: string;
  confirmTitle: string;
  confirmContent: string;
}

export interface TenantDropdownProps {
  /**
   * 当前 tenantId
   */
  value: string;
  /**
   * value变更事件 (value: string) => void;
   */
  onChange: (value: string) => void;
}

const userRootOrgListQuery = gql(/* GraphQL */`query userRootOrgs{
  userRootOrgs{
    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone
  }
}`);

export default (props: TenantDropdownProps) => {
  const locale = useLocale('TenantDropdown'),
    client = useClient(),
    [list, setList] = useState<Array<Org>>([]),
    [info, setInfo] = useState<Org | undefined>(undefined),
    [menu, setMenu] = useState<MenuProps | undefined>(undefined);

  const
    getRequest = async () => {
      const result = await client.query<UserRootOrgsQuery, UserRootOrgsQueryVariables>(userRootOrgListQuery, {}).toPromise();
      if (result.data?.userRootOrgs.length) {
        const orgList = result.data.userRootOrgs as Org[]
        setList(orgList)
      }
    },
    setValue = () => {
      setInfo(list.find(item => item.id == props.value));
      setMenu({
        items: list.filter(item => item?.id != props.value).map(item => {
          return {
            key: item.id,
            label: item.name,
            onClick: menuItemClick
          };
        }),
      });
    },
    menuItemClick = useCallback(({ key }: { key: string }) => {
      Modal.confirm({
        title: locale.confirmTitle,
        content: locale.confirmContent,
        onOk: () => {
          props.onChange(key)
        },
      });
    }, []);

  useEffect(() => {
    if (document.hidden) {
      const tipStr = locale.switchTipTitle;
      document.title = tipStr;
      document.body.innerHTML = `<div style="width:370px;margin:40px auto 0 auto;">${tipStr}</div>`;
      window.close();
    } else {
      setValue()
    }
  }, [props.value]);

  useEffect(() => {
    setValue()
  }, [list]);

  useEffect(() => {
    getRequest();
  }, []);

  return info ? <Dropdown menu={menu} disabled={menu?.items?.length === 0}>
    <span className={styles.action}>
      <span>{info.name}</span>
    </span>
  </Dropdown> : <></>;
};
