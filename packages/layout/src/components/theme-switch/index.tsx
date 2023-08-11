import React from 'react';
import { Switch, SwitchProps } from 'antd';
import { useLocale } from '../locale';

export interface ThemeSwitchLocale {
  bright: string;
  dark: string;
}

export interface ThemeSwitchProps {
  /**
   * 值
   */
  value: boolean;
  /**
   * switch的设置
   */
  switchProps?: SwitchProps;
  /**
   * 值变更事件 (value: boolean) => void;
   */
  onChange: (value: boolean) => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = (props: ThemeSwitchProps) => {
  const locale = useLocale('ThemeSwitch')
  return (
    <Switch
      checkedChildren={locale.bright}
      unCheckedChildren={locale.dark}
      {...props.switchProps}
      checked={props.value}
      onChange={(checked) => {
        props.onChange(checked)
      }}
    />
  );
};

export default ThemeSwitch;
