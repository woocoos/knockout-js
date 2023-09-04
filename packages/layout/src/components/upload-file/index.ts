export type UploadFileLocale = {
  // 文件大小必须小于：
  fileSizeTip: string;
  del: string;
  confirmDel: string;
  // 点击或拖拽文件上传
  clickOrDragUpload: string;
  // 支持扩展名
  supportExtension: string;
  errSupportExtension: string;
}

export interface UploadFileProps<T> {
  /**
   * bucket
   */
  bucket?: string;
  /**
   * 应用code
   */
  appCode?: string;
  /**
   * tenantId
   */
  tenantId?: string;
  /**
   * 目录格式  xxx/ss
   */
  directory?: string;
  /**
   * 强制使用目录当前缀
   */
  forceDirectory?: boolean;
  /**
   * 限制文件大小
   */
  maxSize?: number;
  /**
   * 限制弹框选择
   */
  accept?: string;
  /**
 * 文件 id
 */
  value?: T;
  /**
   * 返回文件id
   * @param value
   * @returns
   */
  onChange?: (value: T) => void;
  /**
   * 返回文件path
   * @param path
   * @returns
   */
  onChangePath?: (path?: T) => void;
}

//字节大小处理
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

// 随机数
export const randomId = (len: number) => {
  let str = '';
  for (; str.length < len; str += Math.random().toString(36).substring(2));
  return str.substring(0, len);
}
