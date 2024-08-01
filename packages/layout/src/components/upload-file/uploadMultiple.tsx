import { UploadOutlined } from "@ant-design/icons";
import { Modal, Typography, Upload, message } from "antd"
import { RcFile, UploadFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadFileProps } from ".";
import { delFile, getStorageUrl, parseStorageData, uploadFile, UploadFileRes } from "@knockout-js/api";
import { useLocale } from "../locale";
import { formatFileSize } from "../_util";

let timeoutFn: NodeJS.Timeout | undefined = undefined;
let files: RcFile[] = [];

export default (props: UploadFileProps<string[]>) => {
  const
    locale = useLocale("UploadFile"),
    [list, setList] = useState<UploadFile<UploadFileRes>[]>([]);

  const
    getValuesFile = async (values?: string[]) => {
      const len = values?.length ?? 0,
        valueList: UploadFile<UploadFileRes>[] = [];
      if (values && len) {
        for (let i = 0; i < len; i++) {
          const data = await parseStorageData(values[i])
          if (data) {
            valueList.push({
              uid: `${i}${data.path}`,
              name: data.name,
              response: data,
              url: data.url,
            })
          }
        }
      }
      setList(valueList)
    },
    runUploadFile = async () => {
      const values = list.map(item => item.response?.storageUrl ?? '') ?? [];
      for (let i = 0; i < files.length; i++) {
        const item = files[i];

        const uData = await uploadFile(item, props.directory, props.useFileName, props.endpoint, props.bucket);
        if (uData?.path) {
          const storageUrl = await getStorageUrl(uData.path, props.endpoint, props.bucket);
          if (storageUrl) {
            values.push(storageUrl)
          }
        }
      }
      props.onChange?.(values);
      files = []
    }

  useEffect(() => {
    getValuesFile(props.value);
  }, [props.value]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutFn);
    };
  }, []);

  return <Upload.Dragger
    accept={props.accept}
    beforeUpload={async (file: RcFile) => {
      const maxSize = props.maxSize || 1024 * 5000;
      if (file.size > maxSize) {
        message.error(`${locale.fileSizeTip}: ${formatFileSize(maxSize)}`);
        return false;
      }


      files.push(file)

      clearTimeout(timeoutFn);
      timeoutFn = setTimeout(async () => {
        await runUploadFile();
      }, 500)

      return false;
    }}
    multiple={true}
    fileList={list}
    onRemove={(file: UploadFile<UploadFileRes>) => {
      Modal.confirm({
        title: locale.del,
        content: `${locale.confirmDel}: ${file.name}`,
        onOk: async () => {
          const storageUrl = file.response?.storageUrl,
            path = file.response?.path
          if (storageUrl && path) {
            const result = await delFile(path, props.endpoint, props.bucket);
            if (result) {
              props.onChange?.(props.value?.filter(item => item != storageUrl) || [])
            } else {
              message.error(locale.errorDel);
            }
          } else {
            props.onChange?.(props.value?.filter(item => item != storageUrl) || [])
          }
        }
      })
    }}
  >
    <br />
    <div>
      <UploadOutlined style={{ fontSize: 40 }} rev={undefined} />
    </div>
    <br />
    <div>
      <Typography.Text type="secondary">
        {locale.clickOrDragUpload}
      </Typography.Text>
    </div>
    <div>
      <Typography.Text type="secondary">
        {`${locale.supportExtension}: ${props.accept?.split(',.').join('、').replace('.', '')}`}
      </Typography.Text>
    </div>
  </Upload.Dragger>
}
