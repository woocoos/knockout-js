import { createContext, useContext } from "react";
import zhCN from "./zh_CN";
import enUS from "./en_US";
import { BasicContext, LocaleType, BasicProviderProps } from "@knockout-js/layout"
import { AppSelectLocale } from "../app-select/index";
import { OrgModalLocale } from "../org-modal";
import { OrgSelectLocale } from "../org-select";
import { AppModalLocale } from "../app-modal";
import { UserModalLocale } from "../user-modal";
import { UserSelectLocale } from "../user-select";

export interface Locale {
  locale: string;
  global: {
    query: string;
    reset: string;
  },
  OrgSelect: OrgSelectLocale;
  OrgModal: OrgModalLocale;
  AppSelect: AppSelectLocale;
  AppModal: AppModalLocale;
  UserSelect: UserSelectLocale;
  UserModal: UserModalLocale;
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

