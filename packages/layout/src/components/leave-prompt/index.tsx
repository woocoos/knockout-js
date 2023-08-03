import { ReactNode, useEffect } from 'react';
import { useLocale } from '../locale';

export interface LeavePromptLocale {
  leavePromptTip: string;
}

export interface LeavePromptProps {
  /**
   * 站点路径
   */
  pathname: string;
  /**
   * 插槽
   */
  children: ReactNode;
}


const eventName = 'updateLeavePromptContext'
let when = true;


/**
 * 一般在layout引入，主要检测浏览器刷新
 * TODO：浏览器的前进和回退无法拦截
 */
export default (props: LeavePromptProps) => {
  const leave = useLocale('LeavePrompt')

  useEffect(() => {
    when = true;
  }, [props.pathname]);

  useEffect(() => {
    window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
      if (when === true) {
        return;
      }
      event.preventDefault();
      event.returnValue = leave.leavePromptTip;
      return leave.leavePromptTip;
    });

    window.addEventListener(eventName, (event: CustomEventInit<boolean>) => {
      when = event.detail || false;
    });
  }, []);

  return <>
    {props.children}
  </>;
};


export const useLeavePrompt = () => {
  const locale = useLocale('LeavePrompt');

  /**
   * 拦截离开检查确认离开后回调
   * @param callback 确认离开
   */
  const checkLeave = () => {
    if (when) {
      return true;
    } else {
      if (confirm(locale.leavePromptTip)) {
        return true;
      }
    }
    return false;
  };

  /**
   * 设置是否拦截离开
   * @param when true:不拦截，false:拦截
   */
  const setLeavePromptWhen = (when: boolean) => {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: when,
    }))
  };

  return [checkLeave, setLeavePromptWhen]
}
