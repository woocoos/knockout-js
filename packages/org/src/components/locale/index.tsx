import { createContext, useContext } from "react";
import zhCN from "./zh_CN";
import { AppSelectLocale } from "../app-select/index";
import { OrgModalLocale } from "../org-modal";
import { OrgSelectLocale } from "../org-select";
import { AppModalLocale } from "../app-modal";

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
}

export interface LocaleProviderProps {
  locale: Locale;
  children: React.ReactNode;
}

export type LocaleContextProps = Locale

// 定义语言上下文
const LocaleContext = createContext<LocaleContextProps>(zhCN);


/**
 * 组件上使用
 */
export default (props: LocaleProviderProps) => {

  const { locale, children } = props;

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}


export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;

/**
 * hook
 * @param componentName
 * @returns
 */
export const useLocale = <C extends LocaleComponentName>(componentName: C) => {
  const localeCtx = useContext<LocaleContextProps>(LocaleContext);
  return { ...localeCtx[componentName] }
}

