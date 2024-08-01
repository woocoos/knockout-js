import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Space, Typography, Upload, message } from "antd"
import { RcFile } from "antd/es/upload";
import { useEffect, useRef, useState } from "react";
import { UploadFileProps } from ".";
import { useLocale } from "../locale";
import styles from "./index.module.css";
import { formatFileSize } from "../_util";
import { getFileRaw, getFileUrl, getStorageUrl, parseStorageData, uploadFile } from "@knockout-js/api";

export default (props: UploadFileProps<string> & {
  /**
  * 显示删除按钮
  */
  showDelBtn?: boolean;
}) => {
  const
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
    getValueFile = async () => {
      if (props.value) {
        const result = await parseStorageData(props.value, undefined, false, props.endpoint, props.bucket);
        if (result) {
          setName(result.name)
          setUrlSrc(result.url)
        }
      }
    },
    updateContent = async () => {
      if (props.value) {
        const dataRes = await parseStorageData(props.value)
        if (dataRes) {
          const result = await getFileRaw(dataRes.path, props.endpoint, props.bucket)
          if (result) {
            const content = await result.Body?.transformToString('utf-8')
            const r = new FileReader()
            r.readAsText(new Blob([content ?? '']), 'utf-8')
            r.onload = () => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.document.write(`<pre>${r.result}</pre>`)
              } else if (iframeRef.current?.contentDocument) {
                iframeRef.current.contentDocument.write(`<pre>${r.result}</pre>`)
              }
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
        beforeUpload={async (file: RcFile) => {
          const maxSize = props.maxSize || (1024 * 1024 * 5);

          if (file.size > maxSize) {
            messageApi.error(`${locale.fileSizeTip}: ${formatFileSize(maxSize)}`);
            return false;
          }
          setLoading(true);
          const result = await uploadFile(file, props.directory, props.useFileName, props.endpoint, props.bucket);
          if (result?.path) {
            const storageUlr = await getStorageUrl(result.path, props.endpoint, props.bucket),
              url = await getFileUrl(result.path, 3600, undefined, props.endpoint, props.bucket)
            setName(file.name)
            setUrlSrc(url)
            props.onChange?.(storageUlr)
          } else {
            messageApi.error(locale.errorUpload);
          }
          setLoading(false);
          return false;
        }}
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
        <a target="_blank" href={urlSrc} download={name} rel="noopener noreferrer">{locale.tempDown}</a>
        {props.showDelBtn ? <Popconfirm
          title={locale.del}
          description={locale.confirmDel}
          onConfirm={() => {
            props.onChange?.()
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
