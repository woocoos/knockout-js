import { ReactNode, useEffect } from 'react';
import KeepAlive, { useAliveController } from 'react-activation';

export interface KeepAliveProps {
  /**
   * 在相同 location.pathname 通过传入id去区分
   */
  id?: string;
  /**
   * 是否需要清空其他keepalive缓存
   */
  clearAlive?: boolean;
  /**
   * 默认插槽
   */
  children: ReactNode;
}

const KA: React.FunctionComponent<React.PropsWithChildren<KeepAliveProps>> = (props: KeepAliveProps) => {
  const cacheKey = btoa(location.pathname),
    { dropScope, getCachingNodes } = useAliveController();

  useEffect(() => {
    if (props.clearAlive) {
      getCachingNodes().forEach(item => {
        if (item.name && cacheKey != item.name) {
          dropScope(item.name);
        }
      });
    }
  }, [props.clearAlive]);

  return (<KeepAlive when autoFreeze={false} cacheKey={cacheKey} name={cacheKey} id={props.id}>
    {props.children}
  </KeepAlive>);
}

KA.defaultProps = {}

export default KA;
