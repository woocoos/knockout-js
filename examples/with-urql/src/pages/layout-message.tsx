import { Button, Space, Card, Divider } from "antd"
import { koMessage } from "@knockout-js/layout"

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <Card title="Message 组件测试用例" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <h4>基础用法 - 自动关闭</h4>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  koMessage.success("操作成功！", 3)
                }}
              >
                success (3秒)
              </Button>
              <Button
                danger
                onClick={() => {
                  koMessage.error("操作失败！", 3)
                }}
              >
                error (3秒)
              </Button>
              <Button
                onClick={() => {
                  koMessage.info("提示信息", 3)
                }}
              >
                info (3秒)
              </Button>
              <Button
                onClick={() => {
                  koMessage.warning("警告信息", 3)
                }}
              >
                warning (3秒)
              </Button>
              <Button
                onClick={() => {
                  koMessage.loading("加载中...", 3)
                }}
              >
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
                onClick={() => {
                  koMessage.success("操作成功！", 0)
                }}
              >
                success (不自动关闭)
              </Button>
              <Button
                danger
                onClick={() => {
                  koMessage.error("操作失败！请检查后重试", 0)
                }}
              >
                error (不自动关闭)
              </Button>
              <Button
                onClick={() => {
                  koMessage.info("这是一条提示信息", 0)
                }}
              >
                info (不自动关闭)
              </Button>
              <Button
                onClick={() => {
                  koMessage.warning("请注意检查输入内容", 0)
                }}
              >
                warning (不自动关闭)
              </Button>
              <Button
                onClick={() => {
                  koMessage.loading("正在处理，请稍候...", 0)
                }}
              >
                loading (不自动关闭)
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <h4>带 onClose 回调</h4>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  koMessage.success("操作成功！", 3, () => {
                    console.log("success message 已关闭")
                    koMessage.info("回调函数已执行", 2)
                  })
                }}
              >
                success + onClose
              </Button>
              <Button
                danger
                onClick={() => {
                  koMessage.error("错误信息", 0, () => {
                    console.log("error message 已手动关闭")
                    koMessage.info("错误消息已关闭", 2)
                  })
                }}
              >
                error + onClose
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <h4>默认时长</h4>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  koMessage.success("使用默认时长")
                }}
              >
                success (默认)
              </Button>
              <Button
                onClick={() => {
                  koMessage.info("使用默认时长")
                }}
              >
                info (默认)
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <h4>复杂内容</h4>
            <Space>
              <Button
                onClick={() => {
                  koMessage.info(
                    <div>
                      <div>复杂内容示例</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        支持 ReactNode 类型
                      </div>
                    </div>,
                    0
                  )
                }}
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
                onClick={() => {
                  koMessage.loading("正在加载...", 0)
                }}
              >
                显示 loading
              </Button>
              <Button
                danger
                onClick={() => {
                  koMessage.destroy()
                }}
              >
                销毁所有消息
              </Button>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  )
}