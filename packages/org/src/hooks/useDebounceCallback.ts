import { useCallback, useEffect, useRef } from 'react';
/**
 * 防抖回调 Hook
 * 在指定延迟内多次调用只会执行最后一次，组件卸载时自动清理
 * 返回 Promise，支持 async 函数
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timerRef.current);
    return new Promise<Awaited<ReturnType<T>>>((resolve) => {
      timerRef.current = setTimeout(() => {
        resolve(fnRef.current(...args));
      }, delay);
    });
  }, [delay]);
}
