import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Space, Typography, Upload, message } from "antd"
import { RcFile } from "antd/es/upload";
import { useEffect, useRef, useState } from "react";
import { files as fileApi } from "@knockout-js/api";
import { useAppCode, useTenantId } from "../provider";
import { UploadFileProps } from ".";
import { useLocale } from "../locale";
import styles from "./index.module.css";
import { formatFileSize, randomId } from "../_util";

export default (props: UploadFileProps<string> & {
  /**
  * 显示删除按钮
  */
  showDelBtn?: boolean;
}) => {
  const
    bucket = props.bucket ?? 'local',
    appCode = props.appCode ?? useAppCode(),
    tenantId = props.tenantId ?? useTenantId(),
    locale = useLocale("UploadFile"),
    [messageApi] = message.useMessage(),
    [loading, setLoading] = useState(false),
    iframeRef = useRef<HTMLIFrameElement>(null),
    [name, setName] = useState<string>(),
    [urlSrc, setUrlSrc] = useState<string>(),
    [modal, setModal] = useState<{
      show: boolean,
    }>({
      show: false,
    });

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
    beforeUpload = async (file: RcFile) => {
      const maxSize = props.maxSize || (1024 * 1024 * 5);

      if (file.size > maxSize) {
        messageApi.error(`${locale.fileSizeTip}: ${formatFileSize(maxSize)}`);
        return false;
      }

      await updateFile(file);
      return false;
    },
    updateFile = async (file: RcFile) => {
      const key = getUploadKey(file);
      setLoading(true);
      if (bucket === 'local') {
        try {
          const result = await fileApi.updateFiles({
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
        const result = await fileApi.getFiles(props.value);
        if (result?.id) {
          setName(result.name)
        }
        if (bucket === 'local') {
          const result = await fileApi.getFilesRaw(props.value, 'url');
          if (typeof result === 'string') {
            setUrlSrc(result)
          }
        }
      } else {
        setUrlSrc(undefined)
      }
    },
    updateContent = async () => {
      if (props.value) {
        const result = await fileApi.getFilesRaw(props.value)
        if (result && typeof result != 'string') {
          const r = new FileReader()
          r.readAsText(result, 'utf-8')
          r.onload = () => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.document.write(r.result as string)
            } else if (iframeRef.current?.contentDocument) {
              iframeRef.current.contentDocument.write(r.result as string)
            }
          }
        }
      }
    }

  useEffect(() => {
    getValueFile();
  }, [props.value]);

  useEffect(() => {
    if (modal.show) {
      updateContent();
    }
  }, [modal.show]);

  return <>
    <Space>
      <Upload
        accept={props.accept}
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        <Button loading={loading} icon={<UploadOutlined rev={undefined} />}>{locale.fileUpload}</Button>
      </Upload>
      <Typography.Text type="secondary">
        {`${locale.supportExtension}: ${props.accept?.split(',.').join('、').replace('.', '')}`}
      </Typography.Text>
    </Space>
    {props.value ? <>
      <div style={{ height: "8px" }}></div>
      <Space >
        <a onClick={() => {
          setModal({ show: true })
        }}
        >{locale.tempViewer}</a>
        <a target="_blank" href={urlSrc} download={name}>{locale.tempDown}</a>
        {props.showDelBtn ? <Popconfirm
          title={locale.del}
          description={locale.confirmDel}
          onConfirm={() => {
            props.onChange?.()
            props.onChangePath?.();
          }}
          okText="Yes"
          cancelText="No"
        >
          <a className={styles.delText}>{locale.del}</a>
        </Popconfirm> : <></>}
      </Space>
      <Modal
        title={locale.tempViewer}
        open={modal.show}
        destroyOnClose
        footer={null}
        width={800}
        onCancel={() => {
          setModal({ show: false })
        }}
      >
        <iframe className={styles.modalIframe} ref={iframeRef}></iframe>
      </Modal>
    </> : <></>}
  </>
}
