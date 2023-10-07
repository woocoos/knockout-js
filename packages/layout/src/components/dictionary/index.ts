import { getDictItems } from "@knockout-js/api";
import { AppDictItem } from "@knockout-js/api/ucenter";
import { useEffect, useState } from "react";

let distItemList: AppDictItem[] = [],
  timeoutFn: NodeJS.Timeout | undefined = undefined;
const collectCode: string[] = [];

/**
 * 用来处理缓存字典项列表
 * @returns
 */
export const useDistItems = (dictCode: string, dataSource?: AppDictItem[]): [AppDictItem[], () => Promise<void>] => {

  const [items, setItems] = useState<AppDictItem[]>([]);

  /**
   * 通过列表设置存储
   * @param list
   */
  const setDistItems = (list: AppDictItem[]) => {
    const dictCodes = [...new Set(list.map(item => item.dict?.code))];
    // 清理掉旧数据
    const newDistItems = distItemList.filter(item => !dictCodes.includes(item.dict?.code));
    newDistItems.push(...list);
    distItemList = newDistItems;
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
      }
      clearTimeout(timeoutFn)
      // 设置收集时间毫秒内收集需要请求的数据
      timeoutFn = setTimeout(() => {
        getDictItems(collectCode).then(result => {
          if (result.length) {
            setDistItems(result);
          }
        });
      }, 100);
    }
  }, [dictCode, dataSource]);

  useEffect(() => {
    setItems(distItemList.filter(item => item.dict?.code === dictCode))
  }, [distItemList])


  return [items, reloadDistItems];
}
