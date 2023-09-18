import { Dropdown, List } from 'antd';
import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Message } from '@knockout-js/api/esm/gql/msgcenter/graphql';
import { getDate } from '../_util';
import { useLocale } from '../locale';

export interface MsgDropdownLocale {
  title: string;
  footer: string;
}

export interface MsgDropdownProps {
  /**
   * 数据源
   */
  dataSource?: Message[];
  /**
   * 选中一项
   * @param data
   * @returns
   */
  onItemClick?: (data: Message) => void;
  /**
   * 查看更多
   * @returns
   */
  onListClick?: () => void;
}

type ItemsTypeData = {
  key: string;
  data: Message;
}

export default (props: MsgDropdownProps) => {
  const locale = useLocale('MsgDropdown'),
    [items, setItems] = useState<ItemsTypeData[]>([]);

  useEffect(() => {
    if (props.dataSource) {
      setItems(props.dataSource.map((item, index) => {
        return {
          key: `${index}`,
          data: item
        }
      }))

    }
  }, [props.dataSource])

  return <Dropdown
    menu={{
      items,
    }}
    placement="bottomRight"
    dropdownRender={() => <List
      className={styles.list}
      header={<div>{locale.title}</div>}
      footer={props.onListClick ? <span className={styles.footer} onClick={() => {
        props.onListClick?.();
      }}>{locale.footer}</span> : undefined}
      bordered
      size="small"
      dataSource={items}
      renderItem={(item) => {
        return <List.Item key={item.key} onClick={() => {
          props.onItemClick?.(item.data)
        }}>
          <List.Item.Meta title={item.data.title} description={getDate(item.data.sendAt, 'YYYY-MM-DD HH:mm:ss')} />
        </List.Item>
      }}
    />}
  >
    <span className={styles.action}>
      <BellOutlined rev={undefined} />
    </span>
  </Dropdown >;
};
