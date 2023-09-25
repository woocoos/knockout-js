import { UploadOutlined } from "@ant-design/icons";
import { Modal, Spin, Typography, Upload, message } from "antd"
import { RcFile, UploadFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadFileProps } from ".";
import { Files, getFiles, getFilesRaw, updateFiles } from "@knockout-js/api";
import { useAppCode, useTenantId } from "../provider";
import { useLocale } from "../locale";
import { formatFileSize, randomId } from "../_util";

let files: RcFile[] = [];
let timeoutFn: NodeJS.Timeout | undefined = undefined;

export default (props: UploadFileProps<string[]>) => {
  const
    bucket = props.bucket ?? 'local',
    appCode = props.appCode ?? useAppCode(),
    tenantId = props.tenantId ?? useTenantId(),
    locale = useLocale("UploadFile"),
    [loading, setLoading] = useState(false),
    [list, setList] = useState<UploadFile<Files>[]>([]);

  const
    getUploadKey = (file: RcFile) => {
      const suffix = file.name.split('.').pop(),
        keys: string[] = [];
      if (props.forceDirectory && props.directory) {
        keys.push(props.directory);
      } else {
        if (appCode) {
          keys.push(appCode);
        }
        if (tenantId) {
          keys.push(tenantId);
        }
        if (props.directory) {
          keys.push(props.directory);
        }
      }
      keys.push(`${randomId(16)}.${suffix}`);
      return `/${keys.join('/')}`.replace('//', '/');
    },
    beforeUpload = async (file: RcFile) => {
      const maxSize = props.maxSize || 1024 * 5000;

      if (file.size > maxSize) {
        message.error(`${locale.fileSizeTip}: ${formatFileSize(maxSize)}`);
        return false;
      }

      files.push(file);
      clearTimeout(timeoutFn);
      timeoutFn = setTimeout(async () => {
        await updateFile();
      }, 500);
      return false;
    },
    updateFile = async () => {
      if (files.length) {
        setLoading(true);
        const values: string[] = props.value || [];
        for (let i in files) {
          const file = files[i],
            key = getUploadKey(file);

          if (bucket === 'local') {
            try {
              const result = await updateFiles({
                key,
                bucket,
                file,
              })
              if (result) {
                values.push(result);
              }
            } catch (error) {
            }
          }
        }
        await getValuesFile(values);
        props.onChange?.(values);
        setLoading(false);
        files = [];
      }
    },
    getValuesFile = async (values?: string[]) => {
      if (values && values.length) {
        const bucket = props.bucket ?? 'local';
        const oldKye = list.map(item => item.uid),
          addKeys = values.filter(key => !oldKye.includes(key)),
          addLength = addKeys.length;
        if (addLength) {
          for (let i = 0; i < addLength; i++) {
            const data: UploadFile = {
              uid: addKeys[i],
              name: '',
            };
            const result = await getFiles(data.uid);
            if (result?.id) {
              data.name = result.name;
              data.linkProps = {
                download: result.name,
              };
              data.response = result;
            }
            if (bucket === 'local') {
              const resultRaw = await getFilesRaw(data.uid, 'url');
              if (typeof resultRaw === 'string') {
                data.url = resultRaw;
              }
            }
            list.push(data);
          }
          setList([...list]);
        }
      } else {
        setList([]);
      }
    }

  useEffect(() => {
    getValuesFile(props.value);
  }, [props.value]);

  useEffect(() => {
    const paths: string[] = [];
    list.forEach(item => {
      if (item.response) {
        paths.push(item.response.path);
      }
    })
    props.onChangePath?.(paths);
  }, [list]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutFn);
    };
  }, []);

  return <Spin spinning={loading} >
    <Upload.Dragger
      accept={props.accept}
      beforeUpload={beforeUpload}
      multiple={true}
      fileList={list}
      onRemove={(file) => {
        Modal.confirm({
          title: locale.del,
          content: `${locale.confirmDel}: ${file.name}`,
          onOk: () => {
            setList(list.filter(item => item.uid != file.uid));
            props.onChange?.(props.value?.filter(item => item != file.uid) || [])
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
  </Spin>
}
