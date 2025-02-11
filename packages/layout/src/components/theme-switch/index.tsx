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
   * 隐藏不显示切换
   */
  isHide?: boolean;
  /**
   * 值变更事件 (value: boolean) => void;
   */
  onChange?: (value: boolean) => void;
}

export default (props: ThemeSwitchProps) => {
  return props.isHide ? <></> : <span className={styles.action}>
    <span>{
      props.value ? <Moon onClick={() => {
        props.onChange?.(false)
      }} /> : <Sun onClick={() => {
        props.onChange?.(true)
      }} />}
    </span>
  </span>
};
