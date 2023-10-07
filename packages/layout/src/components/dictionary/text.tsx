import { AppDictItem } from "@knockout-js/api/ucenter";
import { Typography } from "antd"
import { TextProps } from "antd/es/typography/Text";
import { useEffect, useState } from "react";
import { useDistItems } from ".";

export interface DictionaryTextProps extends TextProps {
  /**
   * 值
   */
  value?: string;
  /**
   * 字典code
   */
  dictCode: string;
  /**
   * 外部提供数据源
   */
  dataSource?: AppDictItem[];
  /**
   * 默认使用code来匹配value
   */
  valueKey?: "id" | "code";
}


export default (props: DictionaryTextProps) => {
  const { value, dataSource, dictCode, valueKey, ...restProps } = props,
    [items] = useDistItems(dictCode, dataSource),
    [dictItem, setDictItem] = useState<AppDictItem>();


  useEffect(() => {
    setDictItem(items.find(item => item[valueKey ?? 'code'] === value));
  }, [value, valueKey, items]);

  return <Typography.Text {...restProps}>
    {dictItem?.name ?? props.value ?? ''}
  </Typography.Text>
}
