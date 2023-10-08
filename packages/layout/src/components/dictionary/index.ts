import { getDictItems } from "@knockout-js/api";
import { AppDictItem } from "@knockout-js/api/ucenter";
import { useEffect, useState } from "react";

let timeoutFn: NodeJS.Timeout | undefined = undefined, isLoad = false;
const distData: Record<string, AppDictItem[] | undefined> = {},
  collectCode: string[] = [];

/**
 * 用来处理缓存字典项列表
 * @returns
 */
export const useDistItems = (dictCode: string, dataSource?: AppDictItem[]): [AppDictItem[], () => Promise<void>] => {

  const [items, setItems] = useState<AppDictItem[]>(distData[dictCode] ?? []);

  /**
   * 通过列表设置存储
   * @param list
   */
  const setDistItems = (list: AppDictItem[]) => {
    const dictCodes = [...new Set(list.map(item => item.dict?.code))];
    dictCodes.forEach(code => {
      if (code) {
        distData[code] = list.filter(item => item.dict?.code == code);
      }
    })
  }

  /**
   * 刷新列表接口
   */
  const reloadDistItems = async () => {
    const result = await getDictItems(dictCode, true);
    if (result.length) {
      setDistItems(result);
    }
  }

  useEffect(() => {
    if (dataSource?.length) {
      setDistItems(dataSource);
    } else {
      if (!collectCode.includes(dictCode)) {
        collectCode.push(dictCode);
        isLoad = true;
      }
      if (isLoad) {
        clearTimeout(timeoutFn)
        timeoutFn = setTimeout(() => {
          getDictItems(collectCode).then(result => {
            if (result.length) {
              setDistItems(result);
            }
            isLoad = false;
          });
        }, 100);
      }
    }
  }, [dictCode, dataSource]);

  useEffect(() => {
    setItems(distData[dictCode]?.filter(item => item.dict?.code === dictCode) ?? [])
  }, [distData[dictCode]])


  return [items, reloadDistItems];
}
