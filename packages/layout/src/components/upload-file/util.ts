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
