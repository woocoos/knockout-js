import { createContext, useContext } from "react";
import zhCN from "./zh_CN";
import enUS from "./en_US";
import { TenantDropdownLocale } from '../tenant-dropdown';
import { ThemeSwitchLocale } from '../theme-switch';
import { LeavePromptLocale } from '../leave-prompt';
import { AvatarDropdownLocale } from '../avatar-dropdown';
import { GatherMenuLocale } from "../gather-menu";

export interface Locale {
  locale: string;
  ThemeSwitch: ThemeSwitchLocale;
  LeavePrompt: LeavePromptLocale;
  AvatarDropdown: AvatarDropdownLocale;
  TenantDropdown: TenantDropdownLocale;
  GatherMenu: GatherMenuLocale;
}

export enum LocaleType {
  zhCN = "zh-CN",
  enUS = "en-US",
}

export interface BasicProviderProps {
  locale: LocaleType;
  children?: React.ReactNode;
}

// 定义语言上下文
export const BasicContext = createContext<BasicProviderProps>({
  locale: LocaleType.zhCN
});

/**
 * 组件上使用
 */
export default (props: BasicProviderProps) => {
  const { locale, children } = props;
  return <BasicContext.Provider value={{ locale: locale }}>{children}</BasicContext.Provider>
}

export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;
/**
 * hook
 * @param componentName
 * @returns
 */
export const useLocale = <C extends LocaleComponentName>(componentName: C) => {
  const ctx = useContext<BasicProviderProps>(BasicContext);
  if (ctx.locale === LocaleType.enUS) {
    return { ...enUS[componentName] }
  }
  // 默认zhCN
  return { ...zhCN[componentName] }
}
