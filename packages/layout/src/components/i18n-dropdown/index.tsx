import { useState, useEffect, useCallback } from 'react';
import { Dropdown, MenuProps } from 'antd';
import styles from './index.module.css';

export interface I18nDropdownProps {
  /**
   * 多语言key
   */
  value: React.Key;
  /**
   * 切换列表
   */
  menuItems: { key: React.Key, label: string }[];
  /**
   * value变更事件 (value: React.Key) => void;
   * @
   */
  onChange: (value: React.Key) => void;
}

function I18nDropdown(props: I18nDropdownProps) {

  const [locale, setLocale] = useState(''),
    [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

  const menuItemsClick = useCallback(({ key }: { key: React.Key }) => {
    props.onChange(key)
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
