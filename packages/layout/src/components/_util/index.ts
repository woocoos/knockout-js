import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 列表数据格式化成树结构
 * @param allList
 * @param parentList
 * @param defineKey
 * @param parentId
 * @returns
 */
export const listFormatTreeData = <T extends Record<string, any> & { children?: T[] }>(
  allList: T[],
  parentList?: T[],
  defineKey?: {
    key?: string;
    parentId?: string;
  },
  parentId?: string | number,
) => {
  const dataKey = { key: 'key', parentId: 'parentId', ...defineKey },
    pid = parentId === undefined ? '0' : parentId;

  if (!parentList) {
    parentList = allList.filter(item => item[dataKey.parentId] == pid);
  }

  parentList.forEach((pItem) => {
    const children = allList.filter(
      (allItem) => allItem[dataKey.parentId] == pItem[dataKey.key],
    );
    if (children && children.length) {
      pItem.children = listFormatTreeData(allList, children, dataKey);
    }
  });
  return parentList;
};

/**
 * 解析树结构按树顺序处理成列表
 * @param treeList
 * @returns
 */
export const treeFormatList = <T extends Record<string, any> & { children?: T[] }>(treeList: T[]) => {
  const allList: T[] = [];

  treeList.forEach(item => {
    const children = item.children;
    delete item.children;
    allList?.push(item);
    if (children) {
      allList.push(...treeFormatList(children));
    }
  });

  return allList;
}

/**
 * 字节大小展示处理
 * @param fileSize
 * @returns
 */
export const formatFileSize = (fileSize: number) => {
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    return (fileSize / 1024).toFixed(2) + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    return (fileSize / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
}

/**
 * 随机数
 * @param len
 * @returns
 */
export const randomId = (len: number) => {
  let str = '';
  for (; str.length < len; str += Math.random().toString(36).substring(2));
  return str.substring(0, len);
}


/**
 * 解析env配置的app地址字符串
 * @param evnStr appCode@deploy_address;
 * @returns
 */
export const parseEnvAppAddress = (evnStr: string) => {
  const address: Record<string, string> = {};
  evnStr.split(';').forEach(str => {
    if (str) {
      const adds = str.split('@');
      if (adds.length === 2) {
        address[adds[0]] = adds[1];
      }
    }
  })
  return address;
}



/**
 * 格式化日期
 * @param date
 * @param format  YYYY-MM-DD HH:mm:ss
 * @param tz  时区
 * @param isTzSet  true将当前时间设置成这个时区，false 将当前时间根据时区转换
 * 例子 isTzSet=true
 *      dayjs.tz("2022-07-07 16:30:00", "America/New_York").format("YYYY-MM-DDTHH:mm:ssZ")
 *      = "2022-07-07T16:30:00-04:00"
 * 例子 isTzSet=false
 *      dayjs("2022-07-07T20:30:00Z").tz("America/New_York").format("YYYY-MM-DD HH:mm:ss")
 *      = "2022-07-07 16:30:00"
 * @returns
 */
export const getDate = (
  date: dayjs.ConfigType,
  format = 'YYYY-MM-DD',
  tz?: string,
  isTzSet?: boolean,
) => {
  if (date) {
    if (tz) {
      if (isTzSet) {
        return dayjs.tz(date, tz).format(format);
      } else {
        return dayjs(date).tz(tz).format(format);
      }
    }
    return dayjs(date).format(format);
  } else {
    return null
  }
};
