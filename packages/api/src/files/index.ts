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

let FILES_API_PREFIX = '/api-files'

/**
 * 调整api前缀
 * @param prefix
 */
export const setFilesApi = (prefix: string) => {
  FILES_API_PREFIX = prefix
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
  const result = await request.post(`${FILES_API_PREFIX}/files`, data, {
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
export async function getFiles(fileId: string | number) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.get(`${FILES_API_PREFIX}/files/${fileId}`)
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
export async function delFiles(fileId: string | number) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.delete(`${FILES_API_PREFIX}/files/${fileId}`)
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
  const result = await request.get(`${FILES_API_PREFIX}/files/${fileId}/raw`, {
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
