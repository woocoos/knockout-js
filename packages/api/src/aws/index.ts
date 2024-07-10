import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { request } from "@ice/plugin-request/request";

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

export class awsS3 {

  private stsApi = '/api-s3/oss/sts'

  private client: S3Client | null = null

  private bucket: string = ''

  private region: string = ''

  private endpoint: string = ''

  private stsData: AwsS3StsData | null = null

  constructor(config: AwsS3Config) {
    this.bucket = config.bucket
    this.region = config.region
    this.endpoint = config.endpoint
    if (config.stsApi) {
      this.stsApi = config.stsApi
    }
  }

  /**
   * 获取STS
   */
  private async getSts() {
    if (this.stsApi) {
      let isGoRequest = true
      if (this.stsData?.expiration) {
        // 小于1分钟就重新获取
        isGoRequest = (new Date(this.stsData.expiration)).getTime() - Date.now() < 60000
      }
      if (isGoRequest) {
        try {
          const result = await request.post<{
            access_key_id: string,
            secret_access_key: string,
            expiration: string,
            session_token: string,
          } | undefined, AwsS3StsRequestData>(this.stsApi, {
            endpoint: this.endpoint,
            bucket: this.bucket,
          })
          if (result?.session_token) {
            this.stsData = {
              accessKeyId: result.access_key_id,
              secretAccessKey: result.secret_access_key,
              sessionToken: result.session_token,
              expiration: result.expiration,
            }
            this.client = new S3Client({
              endpoint: this.endpoint,
              region: this.region,
              credentials: {
                accessKeyId: this.stsData.accessKeyId,
                secretAccessKey: this.stsData.secretAccessKey,
                sessionToken: this.stsData.sessionToken,
              },
            })
          }
        } catch (error) {
          this.client = null
        }
      }
    }
  }

  /**
   * 文件上传
   * @param file File对象
   * @param dir 到哪个目录下
   * @returns
   */
  public async uploadFile(file: File, dir: string) {
    await this.getSts()
    if (this.client) {
      const
        suffix = file.name.split('.').pop(),
        key = `${dir}/${Math.random().toString(36).substring(2)}.${suffix}`.split('/').filter((item) => item).join('/'),
        body = new Blob([file], { type: file.type }),
        command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentEncoding: "utf-8",
          ContentType: file.type,
        })
      try {
        const response = await this.client.send(command)
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
   * @param bucket
   * @returns
   */
  public async delFile(path: string) {
    await this.getSts()
    if (this.client) {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })
      try {
        const response = await this.client.send(command)
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
   * @param bucket
   * @returns
   */
  public async getFileUint8Array(path: string) {
    await this.getSts()
    if (this.client) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
        ResponseContentEncoding: "utf-8",
      })
      try {
        const response = await this.client.send(command)
        if (response?.$metadata?.httpStatusCode === 200) {
          const byteBody = await response.Body?.transformToByteArray()
          if (byteBody) {
            // return URL.createObjectURL(new File([byteBody], path, { type: response.ContentType }));
            return byteBody
          }
        }
      } catch (error) {
      }
    }
    return null
  }

  /**
   * 获取文件url
   * @param path
   * @param expiresIn
   * @returns
   */
  public async getFileUrl(path: string, expiresIn: number = 3600) {
    await this.getSts()
    if (this.client) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
        ResponseContentEncoding: "utf-8",
        ResponseContentDisposition: "inline",
      })
      return await getSignedUrl(this.client, command, { expiresIn })
    }
  }

  /**
   * 根据path得到存储的url
   * @param path
   * @returns
   */
  public getStorageUrl(path: string) {
    return `${this.endpoint}/${this.bucket}/${path}`
  }

  /**
   * 存储的url解析出可展示的url
   * @param url
   * @param expiresIn  default 3600
   * @returns
   */
  public async parseStorageUrl(url: string, expiresIn: number = 3600) {
    const u = new URL(url);
    const endpoint = u.origin;
    const bucket = u.pathname.split('/')[1];
    const path = u.pathname.slice(bucket.length + 2)
    if (endpoint === this.endpoint && bucket === this.bucket && path) {
      return await this.getFileUrl(path, expiresIn)
    } else {
      return url
    }
  }
}
