import { getDictItems } from "@knockout-js/api";
import { AppDictItem } from "@knockout-js/api/ucenter";
import { useAppCode } from "@knockout-js/layout/esm/components/provider";
import { useEffect, useState } from "react";

let timeoutFn: NodeJS.Timeout | undefined = undefined, isLoad = false;
const distData: Record<string, AppDictItem[] | undefined> = {},
  collectRefCodes: string[] = [];

/**
 * 用来处理缓存字典项列表
 * @returns
 */
export const useDistItems = (dictCode: string, appCode?: string, dataSource?: AppDictItem[]): [AppDictItem[], () => Promise<void>] => {
  const refCode = `${appCode ?? useAppCode() ?? ''}:${dictCode}`;
  const [items, setItems] = useState<AppDictItem[]>(distData[refCode] ?? []);

  /**
   * 通过列表设置存储
   * @param list
   */
  const setDistItems = (list: AppDictItem[]) => {
    const refCodes = [...new Set(list.map(item => item.refCode))];
    refCodes.forEach(code => {
      if (code) {
        distData[code] = list.filter(item => item.refCode == code);
      }
    })
  }

  /**
   * 刷新列表接口
   */
  const reloadDistItems = async () => {
    const result = await getDictItems(refCode, true);
    if (result.length) {
      setDistItems(result);
    }
  }

  useEffect(() => {
    if (dataSource?.length) {
      setDistItems(dataSource);
    } else {
      if (!collectRefCodes.includes(refCode)) {
        collectRefCodes.push(refCode);
        isLoad = true;
      }
      if (isLoad) {
        clearTimeout(timeoutFn)
        timeoutFn = setTimeout(() => {
          getDictItems(collectRefCodes).then(result => {
            if (result.length) {
              setDistItems(result);
            }
            isLoad = false;
          });
        }, 100);
      }
    }
  }, [refCode, dataSource]);

  useEffect(() => {
    setItems(distData[refCode]?.filter(item => item.refCode === refCode) ?? [])
  }, [distData[refCode]])


  return [items, reloadDistItems];
}
