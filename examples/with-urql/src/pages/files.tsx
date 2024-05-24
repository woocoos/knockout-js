import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Button, Upload, UploadFile } from "antd";
import { useState } from "react";
// aws sdk 文档
// https://docs.aws.amazon.com/zh_cn/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html

const client = new S3Client({
  endpoint: "http://127.0.0.1:9000",
  region: "local",
  credentials: {
    accessKeyId: "oTbKaIMXjCnx3HzrH5Qo",
    secretAccessKey: "XfvZSw6a954U77hZ3rrSr6jmDKEPFhDNHOJJbW4B",
  },
}), bucket = "test1";

type S3Object = {
  key: string;
  bucket: string;
}


export default () => {

  const [fileList, setFileList] = useState<UploadFile<S3Object>[]>([])
  // const [fileList, setFileList] = useState<UploadFile<S3Object>[]>([{ "uid": "rc-upload-1716535094380-2", "name": "641.jpg", "status": "done", "response": { "bucket": "test1", "key": "1716538460408.jpg" } }])

  const getFile = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentEncoding: "utf-8",
      ResponseContentType: "blob",
    });
    try {
      const response = await client.send(command);
      if (response?.$metadata?.httpStatusCode === 200) {
        const byteBody = await response.Body?.transformToByteArray();
        if (byteBody) {
          return URL.createObjectURL(new File([byteBody], key, { type: response.Metadata?.type }));
        }
      }
    } catch (error) {
    }
    return null
  }

  const updateFile = async (bucket: string, file: File) => {
    const
      suffix = file.name.split('.').pop(),
      key = `${Date.now()}.${suffix}`,
      body = new Blob([file], { type: file.type });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentEncoding: "utf-8",
      Metadata: {
        "type": file.type,
      },
    });
    try {
      const response = await client.send(command);
      if (response?.$metadata?.httpStatusCode === 200) {
        return {
          key,
          bucket,
        }
      }
    } catch (error) {
    }
    return null;
  };

  const delFile = async (bucket: string, key: string) => {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        return true;
      }
    } catch (error) {
    }
    return false;
  }

  return <>
    <h1>测试aws s3</h1>
    {/* accept 值 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept */}
    <Upload
      accept="image/*"
      fileList={fileList}
      beforeUpload={async (file) => {
        const fileData: UploadFile<S3Object> = {
          uid: file.uid,
          name: file.name,
          status: 'uploading',
        };
        const result = await updateFile(bucket, file);
        if (result) {
          fileData.status = 'done';
          fileData.response = { bucket: result.bucket, key: result.key }
        } else {
          fileData.status = 'error';
        }
        setFileList([...fileList, fileData])
        return false
      }}
      onPreview={async (file: UploadFile<S3Object>) => {
        if (file.response?.bucket && file.response?.key) {
          const result = await getFile(file.response.bucket, file.response.key);
          if (result) {
            window.open(result);
          }
        }
      }}
      onRemove={async (file: UploadFile<S3Object>) => {
        if (file.response?.bucket && file.response?.key) {
          await delFile(file.response.bucket, file.response.key);
        }
        setFileList(fileList.filter(item => item.uid !== file.uid))
      }}
    >
      <Button>Click to Upload</Button>
    </Upload>

    {JSON.stringify(fileList)}

  </>
}
