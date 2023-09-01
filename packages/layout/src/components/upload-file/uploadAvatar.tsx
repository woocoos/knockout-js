import { PlusOutlined } from "@ant-design/icons";
import { Spin, Upload, message } from "antd"
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { files } from "@knockout-js/api";
import { useAppCode, useTenantId } from "../provider";
import { randomId } from "./util";


export interface UploadFilesProps {
  /**
   * bucket
   */
  bucket?: string;
  /**
   * 应用code
   */
  appCode?: string;
  /**
   * tenantId
   */
  tenantId?: string;
  /**
   * 目录格式  xxx/ss
   */
  directory?: string;
  /**
   * 强制使用目录当前缀
   */
  forceDirectory?: boolean;
  /**
   * 文件 id
   */
  value?: string;
  /**
   * 限制文件大小
   */
  maxSize?: number;
  /**
   * 限制弹框选择
   */
  accept?: string;
  /**
   * 返回文件id
   * @param value
   * @returns
   */
  onChange?: (value: string) => void;
  /**
   * 返回文件path
   * @param path
   * @returns
   */
  onChangePath?: (path?: string) => void;
}

export default (props: UploadFilesProps) => {
  const
    bucket = props.bucket ?? 'local',
    appCode = props.appCode ?? useAppCode(),
    tenantId = props.tenantId ?? useTenantId(),
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
          const result = await files.updateFiles({
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
    }

  useEffect(() => {
    if (props.value) {
      if (bucket === 'local') {
        files.getFilesRaw(props.value, 'url').then(result => {
          if (typeof result === 'string') {
            setImgsrc(result)
          }
        })
      }
    } else {
      setImgsrc(undefined)
    }
  }, [props.value])

  return <div style={{ display: "inline-block" }}>
    <Spin spinning={loading} >
      <Upload
        accept={props.accept}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={(file) => {
          let isTrue = true;
          const maxSize = props.maxSize || 1024 * 5000

          if (file.size > maxSize) {
            isTrue = false
            messageApi.error('')
          }
          if (isTrue) {
            updateFile(file)
          }
          return false
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
