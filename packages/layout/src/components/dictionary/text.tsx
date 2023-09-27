import { getDictItems } from "@knockout-js/api";
import { AppDictItem } from "@knockout-js/api/ucenter";
import { Typography } from "antd"
import { TextProps } from "antd/es/typography/Text";
import { useEffect, useState } from "react";

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
    [options, setOptions] = useState<AppDictItem[]>([]),
    [dictItem, setDictItem] = useState<AppDictItem>();

  const requestOptions = async () => {
    setOptions(await getDictItems(dictCode));
  }

  useEffect(() => {
    if (props.dataSource) {
      setOptions(props.dataSource.filter(item => item.dict?.code === props.dictCode));
    } else {
      requestOptions()
    }
  }, [value, dataSource, dictCode]);

  useEffect(() => {
    setDictItem(options.find(item => item[valueKey ?? 'code'] === props.value));
  }, [options, valueKey])

  return <Typography.Text {...restProps}>
    {dictItem?.name ?? props.value ?? ''}
  </Typography.Text>
}
