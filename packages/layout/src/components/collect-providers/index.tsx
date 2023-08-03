import { Locale } from "antd/es/locale";
import { LocaleType } from "../locale"
import { ReactNode } from "react";
import { ProConfigProvider } from "@ant-design/pro-provider";
import { BasicProvider, LeavePrompt } from "..";
import { ConfigProvider } from "antd";
import { AliveScope } from "react-activation";

export interface CollectProviderProps {
  /**
   * @knockout-js 的多语言 locale
   */
  locale: LocaleType;
  /**
   * ant 多语言的 locale
   */
  antLocale: Locale;
  /**
   * ProConfig dark主题
   */
  dark: boolean;
  /**
   * 传递动态的 location.pathname
   */
  pathname: string;
  /**
   * 默认插槽
   */
  children: ReactNode;
}

export default (props: CollectProviderProps) => {
  return (
    <ProConfigProvider dark={props.dark}>
      <BasicProvider locale={props.locale}>
        <ConfigProvider locale={props.antLocale}>
          <LeavePrompt pathname={props.pathname}>
            <AliveScope>
              {props.children}
            </AliveScope>
          </LeavePrompt>
        </ConfigProvider>
      </BasicProvider>
    </ProConfigProvider >
  )
}
