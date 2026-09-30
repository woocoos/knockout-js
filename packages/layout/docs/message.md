---
sidebar_label: Message
---

基于 antd `message` 的封装工具，支持 `duration=0` 时不自动关闭，并自动添加手动关闭按钮。

本 Demo 演示用法。

```tsx preview
import { Button, Space, Divider } from "antd";
import { koMessage } from "@knockout-js/layout";

export default () => {
  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <h4>基础用法 - 自动关闭</h4>
          <Space>
            <Button
              type="primary"
              onClick={() => koMessage.success("操作成功！", 3)}
            >
              success (3秒)
            </Button>
            <Button
              danger
              onClick={() => koMessage.error("操作失败！", 3)}
            >
              error (3秒)
            </Button>
            <Button onClick={() => koMessage.info("提示信息", 3)}>
              info (3秒)
            </Button>
            <Button onClick={() => koMessage.warning("警告信息", 3)}>
              warning (3秒)
            </Button>
            <Button onClick={() => koMessage.loading("加载中...", 3)}>
              loading (3秒)
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <h4>duration=0 - 手动关闭（显示关闭按钮）</h4>
          <Space>
            <Button
              type="primary"
              onClick={() => koMessage.success("操作成功！", 0)}
            >
              success (不自动关闭)
            </Button>
            <Button
              danger
              onClick={() => koMessage.error("操作失败！请检查后重试", 0)}
            >
              error (不自动关闭)
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <h4>带 onClose 回调</h4>
          <Space>
            <Button
              type="primary"
              onClick={() =>
                koMessage.success("操作成功！", 3, () => {
                  koMessage.info("回调函数已执行", 2);
                })
              }
            >
              success + onClose
            </Button>
            <Button
              danger
              onClick={() =>
                koMessage.error("错误信息", 0, () => {
                  koMessage.info("错误消息已关闭", 2);
                })
              }
            >
              error + onClose
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <h4>复杂内容（ReactNode）</h4>
          <Space>
            <Button
              onClick={() =>
                koMessage.info(
                  <div>
                    <div>复杂内容示例</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      支持 ReactNode 类型
                    </div>
                  </div>,
                  0
                )
              }
            >
              ReactNode 内容
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <h4>手动销毁</h4>
          <Space>
            <Button
              onClick={() => koMessage.loading("正在加载...", 0)}
            >
              显示 loading
            </Button>
            <Button danger onClick={() => koMessage.destroy()}>
              销毁所有消息
            </Button>
          </Space>
        </div>
      </Space>
    </div>
  );
};
```

## 引入

```ts
import { koMessage } from "@knockout-js/layout";
```

## 特性

- 基于 antd `message` 封装，API 与 antd 保持一致
- 支持 `success` / `error` / `info` / `warning` / `loading` 五种类型
- 当 `duration = 0` 时，消息不自动关闭，并在右侧自动渲染一个手动关闭按钮
- `content` 支持 `ReactNode`，可渲染复杂内容
- 支持 `onClose` 回调，在消息关闭时触发

## API

### 消息方法

每个类型方法的签名完全一致：

```ts
koMessage.success(content, duration?, onClose?);
koMessage.error(content, duration?, onClose?);
koMessage.info(content, duration?, onClose?);
koMessage.warning(content, duration?, onClose?);
koMessage.loading(content, duration?, onClose?);
```

| 名称       | 描述                       |
| ---------- | -------------------------- |
| success    | 显示成功提示               |
| error      | 显示错误提示               |
| info       | 显示信息提示               |
| warning    | 显示警告提示               |
| loading    | 显示加载中提示             |

### 方法参数

| 属性     | 描述                                                       | 类型             | 必填 | 默认值 |
| -------- | ---------------------------------------------------------- | ---------------- | ---- | ------ |
| content  | 消息内容                                                   | ReactNode        | ✅    | -      |
| duration | 自动关闭的延时时长（秒）。设置为 `0` 表示不自动关闭，并显示手动关闭按钮 | number           | ❌    | -      |
| onClose  | 消息关闭时触发的回调函数                                   | () => void       | ❌    | -      |

### 工具方法

| 名称    | 描述                             | 类型                                 |
| ------- | -------------------------------- | ------------------------------------ |
| destroy | 销毁所有消息，透传 antd `message.destroy` | `() => void`                         |
| config  | 全局配置，透传 antd `message.config`  | `(options: MessageConfig) => void`   |

## 注意事项

- `duration` 单位为**秒**，与 antd 原生 `message` 保持一致
- 当且仅当 `duration === 0` 时，消息右侧才会出现关闭按钮
- `destroy()` 会同时关闭所有已存在的消息（包括自动关闭和手动关闭类型）
- 若需要对齐 antd 原生全局配置（如 `top`、`prefixCls` 等），可使用 `koMessage.config(...)` 透传
