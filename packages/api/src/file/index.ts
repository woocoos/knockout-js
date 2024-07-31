import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandInput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { request } from "@ice/plugin-request/request";
import { getFileSource } from "..";

// aws sdk 文档
// https://docs.aws.amazon.com/zh_cn/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html

export type AwsS3Config = {
  bucket: string,
  region: string,
  endpoint: string,
  stsApi?: string,
}

type AwsS3StsRequestData = {
  endpoint: string,
  bucket: string,
}
type AwsS3StsData = {
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken: string,
  expiration: string,
}

let stsApi = '/api-s3/oss/sts'

const
  awsS3Data: Record<string, {
    stsData: AwsS3StsData | null,
    bucketUrl: string,
    client: S3Client,
  } | undefined> = {}

/**
 * 修改STS请求地址
 * @param api
 */
export function setStsApi(api: string) {
  stsApi = api
}

/**
 * 获取缓存client相关数据
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
async function getAwsS3Data(endpoint?: string, bucket?: string, bucketUrl?: string) {
  let filesourceFilter: {
    endpoint?: string,
    bucket?: string,
    bucketUrl?: string,
  } | undefined = undefined
  if (bucketUrl) {
    filesourceFilter = {
      bucketUrl,
    }
  } else if (endpoint && bucket) {
    filesourceFilter = {
      endpoint,
      bucket,
    }
  }

  const filesource = await getFileSource(filesourceFilter)
  if (filesource) {
    const fe = filesource.source.endpoint,
      fb = filesource.source.bucket,
      fr = filesource.source.region,
      fburl = filesource.source.bucketURL,
      key = `${fe}/${fb}/${fr}`
    if (stsApi) {
      if (awsS3Data[key]?.stsData?.expiration) {
        // 小于1分钟就重新获取
        if ((new Date(awsS3Data[key].stsData.expiration)).getTime() - Date.now() < 60000) {
          awsS3Data[key] = undefined
        }
      }
      if (!awsS3Data[key]) {
        try {
          const result = await request.post<{
            access_key_id: string,
            secret_access_key: string,
            expiration: string,
            session_token: string,
          } | undefined, AwsS3StsRequestData>(stsApi, {
            endpoint: fe,
            bucket: fb,
          })
          if (result?.access_key_id) {
            const stsData = {
              accessKeyId: result.access_key_id,
              secretAccessKey: result.secret_access_key,
              sessionToken: result.session_token,
              expiration: result.expiration,
            }
            awsS3Data[key] = {
              stsData,
              bucketUrl: fburl,
              client: new S3Client({
                region: fr,
                credentials: {
                  accessKeyId: stsData.accessKeyId,
                  secretAccessKey: stsData.secretAccessKey,
                  sessionToken: stsData.sessionToken
                },
                bucketEndpoint: true
              })
            }
          }
        } catch (error) {
          awsS3Data[key] = undefined
        }
      }
      return awsS3Data[key]
    }
  }
}


/**
 * 文件上传
 * @param file File对象
 * @param dir  文件目录下
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function uploadFile(file: File, dir: string, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket)
  if (s3Data) {
    const
      suffix = file.name.split('.').pop(),
      key = `${dir}/${Math.random().toString(36).substring(2)}.${suffix}`.split('/').filter((item) => item).join('/'),
      body = new Blob([file], { type: file.type }),
      command = new PutObjectCommand({
        Bucket: s3Data.bucketUrl,
        Key: key,
        Body: body,
        ContentEncoding: "utf-8",
        ContentType: file.type,
        Metadata: {
          name: file.name,
        }
      })
    try {
      const response = await s3Data.client.send(command)
      if (response?.$metadata?.httpStatusCode === 200) {
        return {
          path: key,
        }
      }
    } catch (error) {
    }
  }
  return null
}


/**
 * 文件删除
 * @param path
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function delFile(path: string, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket)
  if (s3Data) {
    const command = new DeleteObjectCommand({
      Bucket: s3Data.bucketUrl,
      Key: path,
    })
    try {
      const response = await s3Data.client.send(command)
      if (response?.$metadata?.httpStatusCode === 204) {
        return true
      }
    } catch (error) {
    }
  }

  return null
}



/**
 * 获取文件流
 * @param path
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 * 可通过下面方法转换成访问url
 * const byteBody = await result.Body?.transformToByteArray()
 * URL.createObjectURL(new File([byteBody], path, { type: response.ContentType }));
 */
export async function getFileRaw(path: string, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket)
  if (s3Data) {
    const command = new GetObjectCommand({
      Bucket: s3Data.bucketUrl,
      Key: path,
      ResponseContentEncoding: "utf-8",
    })
    try {
      const response = await s3Data.client.send(command)
      if (response?.$metadata?.httpStatusCode === 200) {
        return response
      }
    } catch (error) {
    }
  }
  return null
}


/**
 * 获取文件url
 * @param path
 * @param expiresIn  default 3600
 * @param inBrowser  是否在浏览器中展示
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function getFileUrl(path: string, expiresIn: number = 3600, inBrowser?: boolean, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket)
  if (s3Data) {
    const input: GetObjectCommandInput = {
      Bucket: s3Data.bucketUrl,
      Key: path,
      ResponseContentEncoding: "utf-8",
    }
    if (inBrowser) {
      input.ResponseContentDisposition = 'inline'
    } else {
      input.ResponseContentDisposition = 'attachment'
    }
    return await getSignedUrl(s3Data.client, new GetObjectCommand(input), { expiresIn })
  }
}


/**
 * 根据path得到存储的url
 * @param path
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function getStorageUrl(path: string, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket)
  return s3Data ? `${s3Data.bucketUrl}/${path}` : undefined
}

/**
 * 存储的url解析出可展示的url
 * @param url
 * @param expiresIn  default 3600
 * @param inBrowser  是否在浏览器中展示
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function parseStorageUrl(storageUrl: string, expiresIn: number = 3600, inBrowser?: boolean, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket, storageUrl)
  if (s3Data && storageUrl.indexOf(s3Data.bucketUrl) === 0) {
    const path = storageUrl.replace(`${s3Data.bucketUrl}/`, '').split('?')[0]
    return await getFileUrl(path, expiresIn, inBrowser, endpoint, bucket)
  }
  return storageUrl
}

export type UploadFileRes = {
  path: string;
  storageUrl: string;
  url: string;
  name: string;
}


/**
 * 存储的url解析出相关数据
 * @param storageUrl
 * @param expiresIn  default 3600
 * @param inBrowser  是否在浏览器中展示
 * @param endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function parseStorageData(storageUrl: string, expiresIn: number = 3600, inBrowser?: boolean, endpoint?: string, bucket?: string) {
  const s3Data = await getAwsS3Data(endpoint, bucket, storageUrl)
  if (s3Data && storageUrl.indexOf(s3Data.bucketUrl) === 0) {
    const path = storageUrl.replace(`${s3Data.bucketUrl}/`, '').split('?')[0]
    const rawRes = await getFileRaw(path, endpoint, bucket)
    const url = await getFileUrl(path, expiresIn, inBrowser, endpoint, bucket)
    const name = rawRes?.Metadata?.['name'] ?? path.split('/').pop()

    return {
      path,
      storageUrl,
      url,
      name,
    } as UploadFileRes
  }
}
