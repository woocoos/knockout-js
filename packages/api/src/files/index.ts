import { request } from "@ice/plugin-request/request";

type FileSource = {
  id: number;
  kind: "local";
  endpoint: string;
  bucket: string;
  region: string;
}

export type Files = {
  id: string;
  name: string;
  size: number;
  path: string;
  createdAt: string;
  fileSource: FileSource;
}

let ICE_API_FILES_PREFIX = '/api-files'

/**
 * 调整api前缀
 * @param prefix
 */
export const setApiFilesPrefix = (prefix: string) => {
  ICE_API_FILES_PREFIX = prefix
}

/**
 * 上传
 * @param data
 * @returns
 */
export async function updateFiles(data: {
  key: string;
  bucket: string;
  file: File;
}) {
  const result = await request.post(`${ICE_API_FILES_PREFIX}/files`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  if (typeof result === 'string') {
    return result
  }
  return null
}

/**
 * 获取数据
 * @param fileId
 * @returns
 */
export async function getFiles(fileId: string) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.get(`${ICE_API_FILES_PREFIX}/files/${fileId}`)
  if (result?.id) {
    return result as Files;
  }
  return null;
}

/**
 * 删除数据
 * @param fileId
 * @returns
 */
export async function delFiles(fileId: string) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.delete(`${ICE_API_FILES_PREFIX}/files/${fileId}`)
  return result;
}

/**
 * 获取数据
 * @param fileId
 * @param type
 * @returns
 */
export async function getFilesRaw(fileId: string | number, type?: 'url') {
  if (fileId == '0') {
    return null;
  }
  const result = await request.get(`${ICE_API_FILES_PREFIX}/files/${fileId}/raw`, {
    responseType: "blob",
  })
  if (typeof result === 'object' && result.constructor.name === 'Blob') {
    if (type === 'url') {
      return URL.createObjectURL(result);
    } else {
      return result as Blob
    }
  }
  return null;
}
