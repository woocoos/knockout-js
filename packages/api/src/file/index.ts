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
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @param options.bucketUrl  default 是默认fileSource isDefault=true 的bucketUrl
 * @returns
 */
async function getAwsS3Data(options?: {
  endpoint?: string;
  bucket?: string;
  bucketUrl?: string;
}) {
  let filesourceFilter: {
    endpoint?: string,
    bucket?: string,
    bucketUrl?: string,
  } | undefined = undefined
  if (options?.bucketUrl) {
    filesourceFilter = {
      bucketUrl: options.bucketUrl,
    }
  } else if (options?.endpoint && options?.bucket) {
    filesourceFilter = {
      endpoint: options?.endpoint,
      bucket: options?.bucket,
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
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 *
 * 以下两个参数适用于需要覆盖文件的场景 同时使用只生效 useFileName
 * @param options.useFileName  使用file.name当作文件名
 * @param options.custromFileName  使用这个值当作文件名时不包含后缀 custromFileName='fileName'
 * @returns
 */
export async function uploadFile(file: File, dir: string, options?: {
  endpoint?: string;
  bucket?: string;
  useFileName?: boolean;
  custromFileName?: string;
}) {
  const s3Data = await getAwsS3Data({
    endpoint: options?.endpoint,
    bucket: options?.bucket,
  })
  if (s3Data) {
    const
      suffix = file.name.split('.').pop(),
      key = options?.useFileName ?
        `${dir}/${file.name}`.split('/').filter((item) => item).join('/') :
        `${dir}/${options?.custromFileName ? options.custromFileName : Math.random().toString(36).substring(2)}.${suffix}`
          .split('/').filter((item) => item).join('/');

    const body = new Blob([file], { type: file.type }),
      command = new PutObjectCommand({
        Bucket: s3Data.bucketUrl,
        Key: key,
        Body: body,
        ContentEncoding: "utf-8",
        ContentType: file.type,
        Metadata: {
          name: encodeURIComponent(file.name),
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
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function delFile(path: string, options?: {
  endpoint?: string;
  bucket?: string;
}) {
  const s3Data = await getAwsS3Data(options)
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
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 * 可通过下面方法转换成访问url
 * const byteBody = await result.Body?.transformToByteArray()
 * URL.createObjectURL(new File([byteBody], path, { type: response.ContentType }));
 */
export async function getFileRaw(path: string, options?: {
  endpoint?: string;
  bucket?: string;
}) {
  const s3Data = await getAwsS3Data(options)
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
 * @param options.expiresIn  default 3600
 * @param options.inBrowser  true:浏览器内|false:下载|undefault:默认不处理
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function getFileUrl(path: string, options?: {
  expiresIn?: number;
  inBrowser?: boolean;
  endpoint?: string;
  bucket?: string;
}) {
  const s3Data = await getAwsS3Data({
    endpoint: options?.endpoint,
    bucket: options?.bucket
  })
  if (s3Data) {
    const input: GetObjectCommandInput = {
      Bucket: s3Data.bucketUrl,
      Key: path,
      ResponseContentEncoding: "utf-8",
    }, filename = path.split('?')[0].split('/').pop()
    if (options?.inBrowser === true) {
      input.ResponseContentDisposition = `inline; filename="${filename}"`
    } else if (options?.inBrowser === false) {
      input.ResponseContentDisposition = `attachment; filename="${filename}"`
    }
    return await getSignedUrl(
      s3Data.client,
      new GetObjectCommand(input),
      {
        expiresIn: options?.expiresIn ?? 3600
      }
    )
  }
}


/**
 * 根据path得到存储的url
 * @param path
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function getStorageUrl(path: string, options?: {
  endpoint?: string;
  bucket?: string
}) {
  const s3Data = await getAwsS3Data(options)
  return s3Data ? `${s3Data.bucketUrl}/${path}` : undefined
}

/**
 * 存储的url解析出可展示的url
 * @param url
 * @param options.expiresIn  default 3600
 * @param options.inBrowser  是否在浏览器中展示
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function parseStorageUrl(storageUrl: string, options?: {
  expiresIn?: number,
  inBrowser?: boolean,
  endpoint?: string,
  bucket?: string
}) {
  const s3Data = await getAwsS3Data({
    endpoint: options?.endpoint,
    bucket: options?.bucket,
    bucketUrl: storageUrl,
  })
  if (s3Data && storageUrl.indexOf(s3Data.bucketUrl) === 0) {
    const path = storageUrl.replace(`${s3Data.bucketUrl}/`, '').split('?')[0]
    return await getFileUrl(path, options)
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
 * @param options.expiresIn  default 3600
 * @param options.inBrowser  是否在浏览器中展示
 * @param options.endpoint   default 是默认fileSource isDefault=true 的endpoint
 * @param options.bucket     default 是默认fileSource isDefault=true 的bucket
 * @returns
 */
export async function parseStorageData(storageUrl: string, options?: {
  expiresIn?: number,
  inBrowser?: boolean,
  endpoint?: string,
  bucket?: string
}) {
  const s3Data = await getAwsS3Data({
    endpoint: options?.endpoint,
    bucket: options?.bucket,
    bucketUrl: storageUrl,
  })
  if (s3Data && storageUrl.indexOf(s3Data.bucketUrl) === 0) {
    const path = storageUrl.replace(`${s3Data.bucketUrl}/`, '').split('?')[0]
    const rawRes = await getFileRaw(path, {
      endpoint: options?.endpoint,
      bucket: options?.bucket
    })
    const url = await getFileUrl(path, options)
    const name = rawRes?.Metadata?.['name'] ? decodeURIComponent(rawRes?.Metadata?.['name']) : path.split('/').pop()

    return {
      path,
      storageUrl,
      url,
      name,
    } as UploadFileRes
  }
}
