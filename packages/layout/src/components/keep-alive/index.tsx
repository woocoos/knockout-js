import { ReactNode, useEffect } from 'react';
import KeepAlive, { useAliveController } from 'react-activation';

export interface KeepAliveProps {
  id?: string;
  clearAlive?: boolean;
  children: ReactNode;
}

export default (props: KeepAliveProps) => {
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
};
