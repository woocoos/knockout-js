import React from 'react';
import { Switch, SwitchProps } from 'antd';
import { useLocale } from '../locale';

export interface ThemeSwitchLocale {
  bright: string;
  dark: string;
}

export interface ThemeSwitchProps {
  value: boolean;
  switchProps: SwitchProps;
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
