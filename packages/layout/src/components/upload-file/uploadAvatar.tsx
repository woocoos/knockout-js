import { PlusOutlined } from "@ant-design/icons";
import { Spin, Upload, message } from "antd"
import { useEffect, useState } from "react";
import { UploadFileProps } from "./index";
import { useLocale } from "../locale";
import { formatFileSize } from "../_util";
import { parseStorageUrl, getStorageUrl, uploadFile, getFileUrl } from "@knockout-js/api";

export default (props: UploadFileProps<string>) => {
  const locale = useLocale("UploadFile"),
    [messageApi, contextHolder] = message.useMessage(),
    [loading, setLoading] = useState(false),
    [imgsrc, setImgsrc] = useState<string>();

  const getValueFile = async () => {
    if (props.value) {
      const result = await parseStorageUrl(props.value, {
        endpoint: props.endpoint,
        bucket: props.bucket
      });
      if (result) {
        setImgsrc(result)
      }
    } else {
      setImgsrc(undefined)
    }
  }

  useEffect(() => {
    getValueFile()
  }, [props.value])

  return <div style={{ display: "inline-block" }}>
    <Spin spinning={loading} >
      <Upload
        accept={props.accept}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={async (file) => {
          const maxSize = props.maxSize || (1024 * 1024 * 5);

          if (file.size > maxSize) {
            messageApi.error(`${locale.fileSizeTip}: ${formatFileSize(maxSize)}`);
            return false;
          }
          setLoading(true);
          const result = await uploadFile(file, props.directory, {
            endpoint: props.endpoint,
            bucket: props.bucket,
            useFileName: props.useFileName,
            custromFileName: props.custromFileName,
          });

          if (result?.path) {
            const storageUrl = await getStorageUrl(result.path, {
              endpoint: props.endpoint,
              bucket: props.bucket,
            });
            const url = await getFileUrl(result.path, {
              endpoint: props.endpoint,
              bucket: props.bucket
            })
            props.onChange?.(storageUrl);
            setImgsrc(url)
          } else {
            messageApi.error(locale.errorUpload);
          }
          setLoading(false)
          return false;
        }}
      >
        {
          imgsrc ? <img
            src={imgsrc} alt="avatar" style={{ width: '100%' }}
          /> : <>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}></div>
          </>
        }
      </Upload>
    </Spin>
    {contextHolder}
  </div>
}
