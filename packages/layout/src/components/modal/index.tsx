import { ExpandOutlined } from "@ant-design/icons";
import { Modal as AntdModal, Button, ModalProps } from "antd";
import { ReactNode, useRef, useState } from "react";
import Draggable from 'react-draggable';
import styles from './index.modules.css';

const Modal = (props: ModalProps & {
  /**
   * 是否头部可拖拽
   */
  isDraggable?: boolean;
  /**
   * 是否满屏
   */
  defaultScreenful?: boolean;
  /**
   * 全屏图标
   */
  screenfulIcon?: ReactNode | false;
}) => {
  const { width, style, title, defaultScreenful, isDraggable, screenfulIcon, ...restProps } = props;
  const [screenful, setScreenful] = useState(defaultScreenful ?? false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  return <AntdModal
    {...restProps}
    className={screenful ? styles.screenfulModal : undefined}
    width={screenful ? 'auto' : width}
    style={screenful ? { top: 0 } : style}
    title={
      <div
        className={screenful ? "" : styles.modal}
        onMouseOver={() => {
          if (screenful) {
            setDisabled(true);
            return;
          }
          if (disabled) {
            setDisabled(false);
          }
        }}
        onMouseOut={() => {
          setDisabled(true);
        }}
      >
        {title}
        {screenfulIcon === false ? <></> : <Button
          className={styles.screenfulIcon}
          type="text"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setScreenful(!screenful);
          }}
        >
          {screenfulIcon ? screenfulIcon : <ExpandOutlined rev={undefined} />}
        </Button>
        }
      </div>
    }
    modalRender={(modal) => (
      screenful ? modal : isDraggable === false ? modal : <Draggable
        disabled={disabled}
        bounds={bounds}
        nodeRef={draggleRef}
        onStart={(event, uiData) => {
          const { clientWidth, clientHeight } = window.document.documentElement;
          const targetRect = draggleRef.current?.getBoundingClientRect();
          if (!targetRect) {
            return;
          }
          setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
          });
        }}
      >
        <div ref={draggleRef}>{modal}</div>
      </Draggable>
    )}
  />;
}

export default Modal;
