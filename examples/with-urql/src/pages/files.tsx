import { Button, Upload, UploadFile } from "antd";
import { useState } from "react";
import { delFile, getFileUrl, uploadFile } from "@knockout-js/api";

type S3Object = {
  path: string;
  storageUrl: string;
}


export default () => {

  const [fileList, setFileList] = useState<UploadFile<S3Object>[]>([])

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
        const result = await uploadFile(file, `test`)
        if (result) {
          const storageUrl = await getFileUrl(result.path)
          fileData.status = 'done'
          fileData.response = { path: result.path, storageUrl: storageUrl ?? '' }
        } else {
          fileData.status = 'error'
        }
        setFileList([...fileList, fileData])
        return false
      }}
      onPreview={async (file: UploadFile<S3Object>) => {
        if (file.response?.storageUrl) {
          window.open(file.response.storageUrl);
        }
      }}
      onRemove={async (file: UploadFile<S3Object>) => {
        if (file.response?.path) {
          await delFile(file.response.path);
          setFileList(fileList.filter(item => item.uid !== file.uid))
        } else {
          setFileList(fileList.filter(item => item.uid !== file.uid))
        }
      }}
    >
      <Button>Click to Upload</Button>
    </Upload>

    <div>
      {JSON.stringify(fileList)}
    </div>

    <h2> 预览 </h2>
    {fileList.map((item, index) => <div>
      <div>{index + 1}</div>
      <img src={item.response?.storageUrl} width={100} height={100} />
    </div>)
    }
  </>
}

