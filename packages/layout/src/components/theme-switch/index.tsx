import React from 'react';
import { Moon, Sun } from '../icons';

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
   * 值变更事件 (value: boolean) => void;
   */
  onChange: (value: boolean) => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = (props: ThemeSwitchProps) => {
  return props.value ? <Sun style={{ color: 'rgba(0, 0, 0, 0.88)' }} onClick={() => {
    props.onChange(false)

  }} /> : <Moon style={{ color: 'rgba(0, 0, 0, 0.88)' }} onClick={() => {
    props.onChange(true)

  }} />
};

export default ThemeSwitch;
