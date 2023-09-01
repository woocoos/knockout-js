import { Locale } from "antd/es/locale";
import { LocaleType } from "../locale"
import { ReactNode, useEffect, useState } from "react";
import { ProConfigProvider } from "@ant-design/pro-provider";
import { Provider, LeavePrompt } from "..";
import { ConfigProvider } from "antd";
import { AliveScope } from "react-activation";
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
export interface CollectProviderProps {
  /**
   * 应用code
   */
  appCode: string;
  /**
   * tenantId
   */
  tenantId: string;
  /**
   * @knockout-js 的多语言 locale
   */
  locale: LocaleType;
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

  const [antLocale, setAntLocale] = useState<Locale>(zhCN);

  useEffect(() => {
    if (props.locale === LocaleType.zhCN) {
      setAntLocale(zhCN)
    } else if (props.locale === LocaleType.enUS) {
      setAntLocale(enUS)
    }
  }, [props.locale]);

  return (
    <ProConfigProvider dark={props.dark}>
      <Provider locale={props.locale} appCode={props.appCode} tenantId={props.tenantId}>
        <ConfigProvider locale={antLocale}>
          <LeavePrompt pathname={props.pathname}>
            <AliveScope>
              {props.children}
            </AliveScope>
          </LeavePrompt>
        </ConfigProvider>
      </Provider>
    </ProConfigProvider >
  )
}
