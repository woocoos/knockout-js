import { AppDictItem } from "@knockout-js/api/ucenter";

let distItemList: AppDictItem[] = [];

/**
 * 用来处理缓存字典项列表
 * @returns
 */
export const useDistItems = (distCode?: string): [AppDictItem[], (list: AppDictItem[]) => void] => {

  /**
   * 通过distCode获取列表
   */
  const distItems = () => {
    return distCode ? distItemList.filter(item => item.dict?.code === distCode) : [...distItemList];
  }

  /**
   * 通过列表设置存储
   * @param list
   */
  const setDistItems = (list: AppDictItem[]) => {
    const distCodes = [...new Set(list.map(item => item.dict?.code))];
    // 清理掉旧数据
    const newDistItems = distItemList.filter(item => !distCodes.includes(item.dict?.code));
    newDistItems.push(...list);
    distItemList = newDistItems;
  }

  return [distItems(), setDistItems];
}
