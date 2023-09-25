import { useContext } from "react";
import zhCN from "./zh_CN";
import enUS from "./en_US";
import { TenantDropdownLocale } from '../tenant-dropdown';
import { ThemeSwitchLocale } from '../theme-switch';
import { LeavePromptLocale } from '../leave-prompt';
import { AvatarDropdownLocale } from '../avatar-dropdown';
import { AggregateMenuLocale } from "../aggregate-menu";
import { Context, LocaleType, ProviderProps } from "../provider";
import { UploadFileLocale } from "../upload-file";
import { MsgDropdownLocale } from "../msg-dropdown";

export interface Locale {
  locale: string;
  ThemeSwitch: ThemeSwitchLocale;
  LeavePrompt: LeavePromptLocale;
  AvatarDropdown: AvatarDropdownLocale;
  TenantDropdown: TenantDropdownLocale;
  AggregateMenu: AggregateMenuLocale;
  UploadFile: UploadFileLocale;
  MsgDropdown: MsgDropdownLocale;
}



export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;

/**
 * hook
 * @param componentName
 * @returns
 */
export const useLocale = <C extends LocaleComponentName>(componentName: C) => {
  const ctx = useContext<ProviderProps>(Context);
  if (ctx.locale === LocaleType.enUS) {
    return { ...enUS[componentName] }
  }
  // 默认zhCN
  return { ...zhCN[componentName] }
}
