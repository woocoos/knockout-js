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
  errorUpload: string;
  errorDel: string;
  fileUpload: string;
  tempViewer: string;
  tempDown: string;
}

export interface UploadFileProps<T> {
  /**
   * bucket
   */
  bucket?: string;
  /**
   * endpoint
   */
  endpoint?: string;
  /**
   * 目录格式  xxx/xx
   */
  directory: string;
  /**
   * 使用file.name当作文件名
   */
  useFileName?: boolean;
  /**
   * 使用这个值当作文件名时不包含后缀 custromFileName='fileName'
   */
  custromFileName?: string;
  /**
   * 限制文件大小 默认5M
   */
  maxSize?: number;
  /**
   * 限制弹框选择
   */
  accept?: string;
  /**
   * 使用url
   */
  value?: T;
  /**
   * 返回存储数据库的url
   * @param value
   * @returns
   */
  onChange?: (value?: T) => void;

}
