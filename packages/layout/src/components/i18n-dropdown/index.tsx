import { useState, useEffect, useCallback } from 'react';
import { Dropdown, MenuProps } from 'antd';
import styles from './index.module.css';

export interface I18nDropdownProps<T extends React.Key> {
  value: T;
  menuItems: { key: T, label: string }[];
  onChange: (value: T) => void;
}

function I18nDropdown<T extends React.Key>(props: I18nDropdownProps<T>) {

  const [locale, setLocale] = useState(''),
    [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

  const menuItemsClick = useCallback(({ key }: { key: React.Key }) => {
    props.onChange(key as T)
  }, [props.menuItems])

  useEffect(() => {
    const v = props.menuItems?.find(item => item?.key == props.value);
    setLocale(v?.label || '')
  }, [props.value]);

  useEffect(() => {
    setMenuItems(
      props.menuItems.map(item => {
        return {
          key: item.key,
          label: item.label,
          onClick: menuItemsClick,
        }
      })
    )
  }, [props.menuItems])

  return (
    <Dropdown menu={{
      items: menuItems,
    }}>
      <span className={styles.action}>
        <span>{locale}</span>
      </span>
    </Dropdown>
  );
};

export default I18nDropdown;
