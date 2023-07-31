import React from 'react';
import { Switch } from 'antd';
import { useLocale } from '../locale';

export interface ThemeModelLocale {
  bright: string;
  dark: string;
}

export interface ThemeModelProps {
  darkModel: boolean,
  onChange: (darkModel: boolean) => void;
}
const ThemeModel: React.FC<ThemeModelProps> = (props: ThemeModelProps) => {
  const locale = useLocale('ThemeModel')
  return (
    <Switch
      style={{ margin: '0 12px' }}
      checkedChildren={locale.bright}
      unCheckedChildren={locale.dark}
      defaultChecked={!props.darkModel}
      onChange={(checked) => {
        props.onChange(!checked)
      }}
    />
  );
};

export default ThemeModel;
