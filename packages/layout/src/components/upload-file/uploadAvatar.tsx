import { PlusOutlined } from "@ant-design/icons";
import { Spin, Upload, message } from "antd"
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useAppCode, useTenantId } from "../provider";
import { UploadFileProps } from ".";
import { useLocale } from "../locale";
import { formatFileSize, randomId } from "../_util";
import { getFilesRaw, updateFiles } from "@knockout-js/api";

export default (props: UploadFileProps<string>) => {
  const
    bucket = props.bucket ?? 'local',
    appCode = props.appCode ?? useAppCode(),
    tenantId = props.tenantId ?? useTenantId(),
    locale = useLocale("UploadFile"),
    [messageApi] = message.useMessage(),
    [loading, setLoading] = useState(false),
    [imgsrc, setImgsrc] = useState<string>();

  const
    getUploadKey = (file: RcFile) => {
      const suffix = file.name.split('.').pop(),
        keys: string[] = [];
      if (props.forceDirectory && props.directory) {
        keys.push(props.directory)
      } else {
        if (appCode) {
          keys.push(appCode)
        }
        if (tenantId) {
          keys.push(tenantId)
        }
        if (props.directory) {
          keys.push(props.directory)
        }
      }
      keys.push(`${randomId(16)}.${suffix}`);
      return `/${keys.join('/')}`.replace('//', '/');
    },
    updateFile = async (file: RcFile) => {
      const key = getUploadKey(file);
      setLoading(true);
      if (bucket === 'local') {
        try {
          const result = await updateFiles({
            key,
            bucket,
            file,
          })
          if (result) {
            props.onChange?.(result)
            props.onChangePath?.(key);
          }
        } catch (error) {

        }
      }
      setLoading(false)
    },
    getValueFile = async () => {
      if (props.value) {
        if (bucket === 'local') {
          const result = await getFilesRaw(props.value, 'url');
          if (typeof result === 'string') {
            setImgsrc(result)
          }
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

          await updateFile(file);
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
  </div>
}
