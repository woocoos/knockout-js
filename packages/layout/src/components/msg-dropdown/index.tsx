import { Badge, Dropdown, List } from 'antd';
import styles from './index.module.css';
import { useEffect, useState, forwardRef, useImperativeHandle, ForwardedRef, useCallback } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { LayoutPkgUserMsgInternalToListQuery, LayoutPkgUserMsgInternalToListQueryVariables, LayoutPkgUserUnreadMsgInternalsQuery, LayoutPkgUserUnreadMsgInternalsQueryVariables, MsgInternalTo, MsgInternalToOrderField, OrderDirection } from '@knockout-js/api/msgcenter';
import { getDate } from '../_util';
import { useLocale } from '../locale';
import { gql, paging, query } from '@knockout-js/ice-urql/request';
import { instanceName } from '@knockout-js/api';

export interface MsgDropdownLocale {
  title: string;
  footer: string;
}

export interface MsgDropdownProps {
  /**
   * 最多显示几条
   */
  maxLength?: number;
  /**
   * 选中一项
   * @param data
   * @returns
   */
  onItemClick?: (data: MsgInternalTo) => void;
  /**
   * 查看更多
   * @returns
   */
  onMoreClick?: () => void;
}

const userMsgQuery = gql(/* GraphQL */`query layoutPkgUserMsgInternalToList($first: Int,$orderBy: MsgInternalToOrder,$where:MsgInternalToWhereInput){
  userMsgInternalTos(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,msgInternalID,createdAt,deleteAt,readAt,userID
        msgInternal{
          id,tenantID,createdBy,createdAt,subject,body,format,redirect,category
        }
      }
    }
  }
}`)

const userUnreadQuery = gql(/* GraphQL */`query layoutPkgUserUnreadMsgInternals{
  userUnreadMsgInternals
}`)

export type MsgDropdownRef = {
  setShowDot: () => void;
}

export default forwardRef((props: MsgDropdownProps, ref: ForwardedRef<MsgDropdownRef>) => {
  const locale = useLocale('MsgDropdown'),
    [items, setItems] = useState<MsgInternalTo[]>([]),
    [open, setOpen] = useState(false),
    [showDot, setShowDot] = useState(false),
    [loading, setLoading] = useState(false),
    maxLength = props.maxLength ?? 5;

  const
    requestData = useCallback(async () => {
      setLoading(true);
      const result = await paging<LayoutPkgUserMsgInternalToListQuery, LayoutPkgUserMsgInternalToListQueryVariables>(
        userMsgQuery, {
        first: maxLength,
        where: {
          readAtIsNil: true,
        },
        orderBy: {
          direction: OrderDirection.Desc,
          field: MsgInternalToOrderField.CreatedAt
        },
      }, 1, {
        instanceName: instanceName.MSGCENTER,
      }), list: MsgInternalTo[] = [];
      if (result.data?.userMsgInternalTos) {
        result.data.userMsgInternalTos.edges?.forEach(item => {
          if (item?.node) {
            list.push(item.node as MsgInternalTo);
          }
        })
      }
      setShowDot(list.length > 0);
      setItems(list);
      setLoading(false);
    }, []);

  useImperativeHandle(ref, () => ({
    setShowDot: () => {
      setShowDot(true);
    }
  }))

  useEffect(() => {
    if (open) {
      requestData();
    }
  }, [open])

  useEffect(() => {
    query<LayoutPkgUserUnreadMsgInternalsQuery, LayoutPkgUserUnreadMsgInternalsQueryVariables>(userUnreadQuery, {}, {
      instanceName: instanceName.MSGCENTER,
    }).then(result => {
      setShowDot((result.data?.userUnreadMsgInternals ?? 0) > 0);
    });
  }, [])

  return <Dropdown
    trigger={['click']}
    open={open}
    onOpenChange={useCallback((v: boolean) => {
      setOpen(v);
    }, [])}
    placement="bottom"
    dropdownRender={() => <>
      <List
        loading={loading}
        className={styles.list}
        header={<div>{locale.title}</div>}
        footer={props.onMoreClick ? <span
          className={styles.footer}
          onClick={() => {
            props.onMoreClick?.();
          }}
        >
          {locale.footer}
        </span> : undefined}
        bordered
        size="small"
        dataSource={items}
        renderItem={(item) => <List.Item
          key={item.id}
          onClick={() => {
            props.onItemClick?.(item)
          }}
        >
          <List.Item.Meta title={item.msgInternal.subject} description={getDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss')} />
        </List.Item>
        }
      />
    </>}
  >
    <span className={styles.action}>
      <Badge dot={showDot}>
        <BellOutlined rev={undefined} />
      </Badge>
    </span>
  </Dropdown>;
});
