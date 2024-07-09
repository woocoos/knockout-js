import { Button, Upload, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { awsS3, getFileSource } from "@knockout-js/api";

type S3Object = {
  path: string;
  storageUrl: string;
}


export default () => {

  const [s3, setS3] = useState<awsS3>()

  useEffect(() => {
    getFileSource().then((result) => {
      if (result) {
        setS3(new awsS3({
          bucket: result.source.bucket,
          endpoint: result.source.endpoint,
          region: result.source.region,
        }))
      }
    })
  }, [])

  const [fileList, setFileList] = useState<UploadFile<S3Object>[]>([])

  return <>
    <h1>测试aws s3</h1>
    {/* accept 值 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept */}
    <Upload
      accept="image/*"
      fileList={fileList}
      beforeUpload={async (file) => {
        if (s3) {
          const fileData: UploadFile<S3Object> = {
            uid: file.uid,
            name: file.name,
            status: 'uploading',
          };
          const result = await s3.uploadFile(file, `test`)
          if (result) {
            fileData.status = 'done'
            fileData.response = { path: result.path, storageUrl: result.storageUrl }
          } else {
            fileData.status = 'error'
          }
          setFileList([...fileList, fileData])
        }
        return false
      }}
      onPreview={async (file: UploadFile<S3Object>) => {
        console.log('click:file', file)
        if (file.response?.path && s3) {
          const result = await s3.getFile(file.response.path);
          if (result) {
            window.open(result as string);
          }
        }
      }}
      onRemove={async (file: UploadFile<S3Object>) => {
        if (file.response?.path && s3) {
          await s3.delFile(file.response.path);
          setFileList(fileList.filter(item => item.uid !== file.uid))
        } else {
          setFileList(fileList.filter(item => item.uid !== file.uid))
        }
      }}
    >
      <Button>Click to Upload</Button>
    </Upload>

    {JSON.stringify(fileList)}

  </>
}

