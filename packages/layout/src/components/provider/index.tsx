import { createContext, useContext } from "react";
import { LocaleType } from "../locale";

export interface ProviderProps {
  locale?: LocaleType;
  appCode?: string;
  tenantId?: string;
  dark?: boolean;
  children?: React.ReactNode;
}

// 定义上下文
export const Context = createContext<ProviderProps>({
  locale: LocaleType.zhCN,
  dark: false
});

/**
 * 组件上使用
 */
export default (props: ProviderProps) => {
  const { children, ...resProps } = props;
  return <Context.Provider value={{ ...resProps }}>{children}</Context.Provider>
}


/**
 * hook
 * @returns
 */
export const useTenantId = () => {
  const ctx = useContext<ProviderProps>(Context);
  return ctx.tenantId
}


/**
 * hook
 * @returns
 */
export const useAppCode = () => {
  const ctx = useContext<ProviderProps>(Context);
  return ctx.appCode
}

/**
 * hook
 * @returns
 */
export const useDark = () => {
  const ctx = useContext<ProviderProps>(Context);
  return ctx.dark ?? false
}
