/**
 * 自定义 Message 工具
 * 封装 antd 的 message，支持：
 * 1. duration 设置为0时不自动关闭
 * 2. 自动添加关闭按钮
 */

import { message } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface MessageConfig {
  content: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  key?: string;
}

/**
 * 创建带关闭按钮的内容
 */
const createContentWithClose = (
  content: React.ReactNode,
  duration: number | undefined,
  onClose?: () => void,
  onCloseClick?: () => void
): React.ReactNode => {
  // 只有当 duration 为 0 时才添加关闭按钮
  if (duration === 0) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: '100%' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{content}</span>
        <CloseOutlined
          style={{
            cursor: 'pointer',
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.45)',
            padding: 4,
            flexShrink: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCloseClick?.();
            onClose?.();
          }} rev={undefined} />
      </span>
    );
  }
  return content;
};

/**
 * 通用消息方法
 */
const showMessage = (
  type: MessageType,
  content: React.ReactNode,
  duration?: number,
  onClose?: () => void
) => {
  let messageKey: string | undefined;

  const closeMessage = () => {
    if (messageKey) {
      message.destroy(messageKey);
    }
  };

  const config: MessageConfig = {
    content: createContentWithClose(content, duration, onClose, closeMessage),
    duration: duration,
    onClose: onClose,
    key: `msg_${Date.now()}_${Math.random()}`,
  };

  messageKey = config.key;

  switch (type) {
    case 'success':
      return message.success(config);
    case 'error':
      return message.error(config);
    case 'info':
      return message.info(config);
    case 'warning':
      return message.warning(config);
    case 'loading':
      return message.loading(config);
    default:
      return message.info(config);
  }
};

/**
 * 自定义 message 对象
 * 用法与 antd message 相同，但 duration 为 0 时会自动添加关闭按钮
 *
 * @example
 * koMessage.error('错误信息', 0); // 不自动关闭，显示关闭按钮
 * koMessage.success('成功信息', 3); // 3秒后自动关闭
 * koMessage.info('提示信息'); // 使用默认时长
 */
export const koMessage = {
  success: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    showMessage('success', content, duration, onClose),

  error: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    showMessage('error', content, duration, onClose),

  info: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    showMessage('info', content, duration, onClose),

  warning: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    showMessage('warning', content, duration, onClose),

  loading: (content: React.ReactNode, duration?: number, onClose?: () => void) =>
    showMessage('loading', content, duration, onClose),

  // 保留原生 message 的其他方法
  destroy: message.destroy,
  config: message.config,
};

export default koMessage;
