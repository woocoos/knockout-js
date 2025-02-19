import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { CloseOutlined, DragOutlined, } from "@ant-design/icons";
import { AppMenu } from "@knockout-js/api/ucenter";
import styles from "./index.module.css";
import { Space } from "antd";
import { OpenWin } from "../icons";
import { CollectsDataSource } from ".";

/**
 * 排序拖拽使用的控件
 * https://docs.dndkit.com/
 * @param props
 * @returns
 */
const DargMenuItem = (props: {
  id?: string;
  value: AppMenu;
  onDel: () => void;
  onClick: (isOpen?: boolean) => void;
}) => {
  const id = `${props.value.appID}-${props.value.id}`;
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div
    key={props.id}
    ref={setNodeRef}
    style={style}
    {...attributes}
    className={styles.aggregateMenuDrawerMenuItem}
    onClick={() => {
      props.onClick();
    }}
  >
    <div className={styles.aggregateMenuDrawerMenuItemName}>{props.value.name}</div>
    <div className={styles.aggregateMenuDrawerMenuItemIcons}>
      <Space>
        <OpenWin className="anticon" onClick={(event) => {
          event.stopPropagation();
          props.onClick(true);
        }} />
        <CloseOutlined rev={undefined} onClick={(event) => {
          event.stopPropagation();
          props.onDel();
        }} />
        <DragOutlined rev={undefined}  {...listeners} className="dragIcon" />
      </Space>
    </div>
  </div>
}


/**
 * 排序拖拽使用的控件
 * https://docs.dndkit.com/
 * @param props
 * @returns
 */
const DargAppItem = (props: {
  app: CollectsDataSource;
  onDragEnd?: (event: DragEndEvent, type: 'menu') => void;
  onDel?: (menuItem: AppMenu) => void;
  onClick?: (menuItem: AppMenu, isOpen?: boolean) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const id = props.app.id;
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div>
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={styles.aggregateMenuDrawerAppItem}
    >
      <div className={`${styles.aggregateMenuDrawerAppItemName} dragAppItem`}>{props.app.name}</div>
      <div className={styles.aggregateMenuDrawerAppItemIcons}>
        <Space>
          <DragOutlined rev={undefined}  {...listeners} className="dragIcon" />
        </Space>
      </div>
    </div>
    <div className={styles.aggregateMenuDrawerMenuGroup}>
      <DndContext sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          props.onDragEnd?.(event, 'menu')
        }}
      >
        <SortableContext
          items={props.app.children.map(item => `${props.app.id}-${item.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {
            props.app.children.map(item => (
              <DargMenuItem
                key={`${props.app.id}-${item.id}`}
                id={`${props.app.id}-${item.id}`}
                value={item}
                onDel={() => {
                  props.onDel?.(item)
                }}
                onClick={(isOpen) => {
                  props.onClick?.(item, isOpen)
                }}
              />
            ))
          }
        </SortableContext>
      </DndContext>
    </div>
  </div>

}

type AggregateCollectsProps = {
  dataSource: CollectsDataSource[];
  onDragEnd?: (event: DragEndEvent, type: 'app' | 'menu') => void;
  onDel?: (menuItem: AppMenu) => void;
  onClick?: (menuItem: AppMenu, isOpen?: boolean) => void;
}

export default (props: AggregateCollectsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return <DndContext sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={(event) => {
      props.onDragEnd?.(event, 'app')
    }}
  >
    <SortableContext
      items={props.dataSource.map(item => item.id)}
      strategy={verticalListSortingStrategy}
    >
      {
        props.dataSource.map(item => (
          <DargAppItem
            key={item.id}
            app={item}
            onDel={props.onDel}
            onClick={props.onClick}
            onDragEnd={props.onDragEnd}
          />
        ))
      }
    </SortableContext>
  </DndContext>
}
