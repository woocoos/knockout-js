import { ReloadOutlined } from "@ant-design/icons";
import { AppDictItem } from "@knockout-js/api/ucenter";
import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getDictItems } from "@knockout-js/api";

export interface DictionarySelectProps extends SelectProps {
  /**
   * 字典code
   */
  dictCode: string;
  /**
   * 外部提供数据源
   */
  dataSource?: AppDictItem[];
  /**
   * changeValue=id: onChange的第一个参数值就为code
   */
  changeValue?: "id" | "code";
}

type DictionarySelectOption = {
  label: string;
  value: string;
  data: AppDictItem;
}

export default (props: DictionarySelectProps) => {
  const { dictCode, dataSource, changeValue, ...restProps } = props,
    [loading, setLoading] = useState(false),
    [options, setOptions] = useState<DictionarySelectOption[]>([]);

  const requestOptions = async () => {
    setLoading(true);
    const result = await getDictItems(dictCode);
    setOptions(result.map(item => ({
      label: item.name,
      value: item[changeValue ?? 'code'],
      data: item,
    })));
    setLoading(false);
  }

  useEffect(() => {
    if (dataSource?.length) {
      setOptions(dataSource
        .filter(item => item.dict?.code === dictCode)
        .map(item => ({
          label: item.name,
          value: item[changeValue ?? 'code'],
          data: item,
        }))
      );
    } else {
      requestOptions();
    }
  }, [dictCode, dataSource])

  return <Select
    style={{ width: '100%' }}
    {...restProps}
    loading={loading}
    options={options}
    dropdownRender={(menu) => <>
      {menu}
      <div className={styles.selectActions}>
        <ReloadOutlined rev={undefined} onClick={async () => {
          await requestOptions();
        }} />
      </div>
    </>
    }
  />
}
