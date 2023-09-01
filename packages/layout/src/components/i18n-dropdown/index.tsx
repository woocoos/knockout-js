import { useState, useEffect, useCallback, useContext } from 'react';
import { Dropdown, MenuProps } from 'antd';
import styles from './index.module.css';
import { Context, ProviderProps, LocaleType } from '..';

export interface I18nDropdownProps {
  /**
   * 值变更事件 (value: LocaleType) => void;
   */
  onChange?: (value: LocaleType) => void;
}

function I18nDropdown(props: I18nDropdownProps) {
  const ctx = useContext<ProviderProps>(Context),
    [localeName, setLocaleName] = useState(''),
    menuItemOnClick = useCallback(({ key }: { key: React.Key }) => {
      props.onChange?.(key as LocaleType)
    }, []),
    menuItems = [
      {
        key: LocaleType.zhCN,
        label: '简体',
        onClick: menuItemOnClick,
      },
      {
        key: LocaleType.enUS,
        label: 'En',
        onClick: menuItemOnClick,
      }
    ];

  useEffect(() => {
    const item = menuItems?.find(item => item?.key == ctx.locale);
    setLocaleName(item?.label || '')
  }, [ctx.locale]);

  return (
    <Dropdown menu={{
      items: menuItems,
    }}>
      <span className={styles.action}>
        <span>{localeName}</span>
      </span>
    </Dropdown>
  );
};

export default I18nDropdown;
