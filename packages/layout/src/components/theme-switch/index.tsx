import React from 'react';
import { Moon, Sun } from '../icons';
import styles from './index.module.css';

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
  return <span className={styles.action}>
    <span>{
      props.value ? <Moon onClick={() => {
        props.onChange(false)

      }} /> : <Sun onClick={() => {
        props.onChange(true)

      }} />}
    </span>
  </span>
};

export default ThemeSwitch;
