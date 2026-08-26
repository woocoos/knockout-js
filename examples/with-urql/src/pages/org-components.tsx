import { useState } from 'react';
import { Card, Divider, Space, Button, Typography, Form, Switch, Descriptions } from 'antd';
import { AppSelect, AppModal, OrgSelect, OrgModal, UserSelect, UserModal } from '@knockout-js/org';
import { OrgKind, App, Org, User } from '@knockout-js/api/ucenter';

const { Title, Paragraph } = Typography;

/**
 * org 组件测试页面
 * 覆盖 AppSelect / AppModal / OrgSelect / OrgModal / UserSelect / UserModal 的常用场景
 */
export default function OrgComponents() {
  // ---------- AppSelect ----------
  const [appValue, setAppValue] = useState<App | string>();
  const [appIdValue, setAppIdValue] = useState<string>();
  const [appReadonly, setAppReadonly] = useState(false);
  const [appDisabled, setAppDisabled] = useState(false);
  const [appChangeLog, setAppChangeLog] = useState<string[]>([]);

  // ---------- OrgSelect ----------
  const [orgValue, setOrgValue] = useState<Org | string>();
  const [orgReadonly, setOrgReadonly] = useState(false);
  const [orgDisabled, setOrgDisabled] = useState(false);
  const [orgChangeLog, setOrgChangeLog] = useState<string[]>([]);

  // ---------- UserSelect ----------
  const [userValue, setUserValue] = useState<User | string>();
  const [userReadonly, setUserReadonly] = useState(false);
  const [userDisabled, setUserDisabled] = useState(false);
  const [userChangeLog, setUserChangeLog] = useState<string[]>([]);

  // ---------- Modal 控制 ----------
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [appModalMultipleOpen, setAppModalMultipleOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // ---------- Modal 选中结果 ----------
  const [appModalResult, setAppModalResult] = useState<App[]>();
  const [appModalMultipleResult, setAppModalMultipleResult] = useState<App[]>();
  const [orgModalResult, setOrgModalResult] = useState<Org[]>();
  const [userModalResult, setUserModalResult] = useState<User[]>();

  const logChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, label: string) =>
    (value: unknown, original?: unknown) => {
      const msg = `[${new Date().toLocaleTimeString()}] ${label}: value=${JSON.stringify(value)}, original=${JSON.stringify(original)}`;
      setter(prev => [msg, ...prev].slice(0, 20));
    };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Org 组件测试</Title>
      <Paragraph type="secondary">
        覆盖 AppSelect / OrgSelect / UserSelect 的常用场景，以及 AppModal / OrgModal / UserModal 的独立使用。
      </Paragraph>

      {/* ==================== AppSelect ==================== */}
      <Card title="AppSelect 应用选择" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <span>只读:</span>
            <Switch checked={appReadonly} onChange={setAppReadonly} />
            <span>禁用:</span>
            <Switch checked={appDisabled} onChange={setAppDisabled} />
          </Space>

          <Form layout="vertical">
            <Form.Item label="1. 基础用法 - value 为对象">
              <AppSelect
                value={appValue as App}
                readonly={appReadonly}
                disabled={appDisabled}
                onChange={logChange(setAppChangeLog, 'AppSelect(对象)')}
                onOriginalChange={(v) => setAppValue(v)}
              />
              <Paragraph type="secondary" style={{ marginTop: 4 }}>
                当前值: {JSON.stringify(appValue)}
              </Paragraph>
            </Form.Item>

            <Form.Item label="2. value 为 ID 字符串 + changeValue='id'">
              <AppSelect
                value={appIdValue}
                changeValue="id"
                readonly={appReadonly}
                disabled={appDisabled}
                onChange={(v) => setAppIdValue(v as string)}
                onOriginalChange={(v) => setAppChangeLog(prev => [`[ID变更] ${v?.name}(${v?.id})`, ...prev].slice(0, 20))}
              />
              <Paragraph type="secondary" style={{ marginTop: 4 }}>
                当前 ID: {appIdValue ?? '(空)'}
              </Paragraph>
            </Form.Item>

            <Form.Item label="3. 带 dataSource 缓存 - 避免 ID 反查请求">
              <AppSelect
                value={appIdValue}
                changeValue="id"
                dataSource={appValue && typeof appValue !== 'string' ? [appValue] : []}
                readonly={appReadonly}
                disabled={appDisabled}
                onChange={(v) => setAppIdValue(v as string)}
              />
            </Form.Item>

            <Form.Item label="4. onOriginalChange - onChange 被占用时的备选">
              <AppSelect
                readonly={appReadonly}
                disabled={appDisabled}
                onOriginalChange={(v) => {
                  setAppChangeLog(prev => [`[onOriginalChange] ${v?.name ?? '清空'}`, ...prev].slice(0, 20));
                }}
              />
            </Form.Item>
          </Form>

          {appChangeLog.length > 0 && (
            <>
              <Divider orientation="left" plain>变更日志</Divider>
              <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                {appChangeLog.join('\n')}
              </pre>
              <Button size="small" onClick={() => setAppChangeLog([])}>清空日志</Button>
            </>
          )}
        </Space>
      </Card>

      {/* ==================== OrgSelect ==================== */}
      <Card title="OrgSelect 组织选择" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <span>只读:</span>
            <Switch checked={orgReadonly} onChange={setOrgReadonly} />
            <span>禁用:</span>
            <Switch checked={orgDisabled} onChange={setOrgDisabled} />
          </Space>

          <Form layout="vertical">
            <Form.Item label="1. 基础用法 - kind=Org">
              <OrgSelect
                kind={OrgKind.Org}
                value={orgValue as Org}
                readonly={orgReadonly}
                disabled={orgDisabled}
                onChange={logChange(setOrgChangeLog, 'OrgSelect(Org)')}
                onOriginalChange={(v) => setOrgValue(v)}
              />
              <Paragraph type="secondary" style={{ marginTop: 4 }}>
                当前值: {JSON.stringify(orgValue)}
              </Paragraph>
            </Form.Item>

            <Form.Item label="2. value 为 ID 字符串 + changeValue='id'">
              <OrgSelect
                kind={OrgKind.Org}
                value={typeof orgValue === 'string' ? orgValue : orgValue?.id}
                changeValue="id"
                readonly={orgReadonly}
                disabled={orgDisabled}
                onChange={(v) => {
                  setOrgValue(v as string);
                  setOrgChangeLog(prev => [`[ID变更] ${v}`, ...prev].slice(0, 20));
                }}
              />
            </Form.Item>

            <Form.Item label="3. kind=Root - 选择根组织">
              <OrgSelect
                kind={OrgKind.Root}
                readonly={orgReadonly}
                disabled={orgDisabled}
                onOriginalChange={(v) => {
                  setOrgChangeLog(prev => [`[Root组织] ${v?.name ?? '清空'}`, ...prev].slice(0, 20));
                }}
              />
            </Form.Item>
          </Form>

          {orgChangeLog.length > 0 && (
            <>
              <Divider orientation="left" plain>变更日志</Divider>
              <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                {orgChangeLog.join('\n')}
              </pre>
              <Button size="small" onClick={() => setOrgChangeLog([])}>清空日志</Button>
            </>
          )}
        </Space>
      </Card>

      {/* ==================== UserSelect ==================== */}
      <Card title="UserSelect 用户选择" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <span>只读:</span>
            <Switch checked={userReadonly} onChange={setUserReadonly} />
            <span>禁用:</span>
            <Switch checked={userDisabled} onChange={setUserDisabled} />
          </Space>

          <Form layout="vertical">
            <Form.Item label="1. 基础用法 - 选择所有用户">
              <UserSelect
                value={userValue as User}
                readonly={userReadonly}
                disabled={userDisabled}
                onChange={logChange(setUserChangeLog, 'UserSelect(全部)')}
                onOriginalChange={(v) => setUserValue(v)}
              />
              <Paragraph type="secondary" style={{ marginTop: 4 }}>
                当前值: {JSON.stringify(userValue)}
              </Paragraph>
            </Form.Item>

            <Form.Item label="2. value 为 ID 字符串 + changeValue='id'">
              <UserSelect
                value={typeof userValue === 'string' ? userValue : userValue?.id}
                changeValue="id"
                readonly={userReadonly}
                disabled={userDisabled}
                onChange={(v) => {
                  setUserValue(v as string);
                  setUserChangeLog(prev => [`[ID变更] ${v}`, ...prev].slice(0, 20));
                }}
              />
            </Form.Item>

            <Form.Item label="3. onOriginalChange - 只获取完整对象">
              <UserSelect
                readonly={userReadonly}
                disabled={userDisabled}
                onOriginalChange={(v) => {
                  setUserChangeLog(prev => [
                    `[onOriginalChange] ${v?.displayName ?? '清空'} (${v?.contact?.email ?? '-'})`,
                    ...prev,
                  ].slice(0, 20));
                }}
              />
            </Form.Item>
          </Form>

          {userChangeLog.length > 0 && (
            <>
              <Divider orientation="left" plain>变更日志</Divider>
              <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                {userChangeLog.join('\n')}
              </pre>
              <Button size="small" onClick={() => setUserChangeLog([])}>清空日志</Button>
            </>
          )}
        </Space>
      </Card>

      {/* ==================== AppModal 独立使用 ==================== */}
      <Card title="AppModal 应用弹框 - 独立使用" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <Button type="primary" onClick={() => setAppModalOpen(true)}>
              打开单选弹框
            </Button>
            <Button onClick={() => setAppModalMultipleOpen(true)}>
              打开多选弹框
            </Button>
          </Space>

          {appModalResult && (
            <Descriptions title="单选结果" bordered size="small" column={1}>
              <Descriptions.Item label="ID">{appModalResult[0]?.id}</Descriptions.Item>
              <Descriptions.Item label="名称">{appModalResult[0]?.name}</Descriptions.Item>
              <Descriptions.Item label="编码">{appModalResult[0]?.code}</Descriptions.Item>
            </Descriptions>
          )}

          {appModalMultipleResult && appModalMultipleResult.length > 0 && (
            <>
              <Divider orientation="left" plain>多选结果 ({appModalMultipleResult.length} 项)</Divider>
              <Descriptions bordered size="small" column={3}>
                {appModalMultipleResult.map(app => (
                  <Descriptions.Item key={app.id} label={app.name}>
                    {app.code}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}

          <AppModal
            open={appModalOpen}
            title="选择应用（单选）"
            onClose={(data) => {
              setAppModalResult(data);
              setAppModalOpen(false);
            }}
          />
          <AppModal
            open={appModalMultipleOpen}
            title="选择应用（多选）"
            isMultiple
            onClose={(data) => {
              setAppModalMultipleResult(data);
              setAppModalMultipleOpen(false);
            }}
          />
        </Space>
      </Card>

      {/* ==================== OrgModal 独立使用 ==================== */}
      <Card title="OrgModal 组织弹框 - 独立使用" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button type="primary" onClick={() => setOrgModalOpen(true)}>
            打开组织弹框
          </Button>

          {orgModalResult && orgModalResult.length > 0 && (
            <Descriptions title="选中结果" bordered size="small" column={1}>
              <Descriptions.Item label="ID">{orgModalResult[0]?.id}</Descriptions.Item>
              <Descriptions.Item label="名称">{orgModalResult[0]?.name}</Descriptions.Item>
              <Descriptions.Item label="域">{orgModalResult[0]?.domain}</Descriptions.Item>
              <Descriptions.Item label="类型">{orgModalResult[0]?.kind}</Descriptions.Item>
            </Descriptions>
          )}

          <OrgModal
            open={orgModalOpen}
            title="选择组织"
            kind={OrgKind.Org}
            onClose={(data) => {
              setOrgModalResult(data);
              setOrgModalOpen(false);
            }}
          />
        </Space>
      </Card>

      {/* ==================== UserModal 独立使用 ==================== */}
      <Card title="UserModal 用户弹框 - 独立使用" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button type="primary" onClick={() => setUserModalOpen(true)}>
            打开用户弹框
          </Button>

          {userModalResult && userModalResult.length > 0 && (
            <Descriptions title="选中结果" bordered size="small" column={1}>
              <Descriptions.Item label="ID">{userModalResult[0]?.id}</Descriptions.Item>
              <Descriptions.Item label="显示名称">{userModalResult[0]?.displayName}</Descriptions.Item>
              <Descriptions.Item label="登录名称">{userModalResult[0]?.principalName}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{userModalResult[0]?.contact?.email}</Descriptions.Item>
            </Descriptions>
          )}

          <UserModal
            open={userModalOpen}
            title="选择用户"
            onClose={(data) => {
              setUserModalResult(data);
              setUserModalOpen(false);
            }}
          />
        </Space>
      </Card>

      {/* ==================== 快捷键说明 ==================== */}
      <Card title="快捷键说明" style={{ marginBottom: 24 }}>
        <Paragraph>
          <ul>
            <li><strong>Alt + Enter</strong>：在 Modal 弹框中快速确认选择（仅最顶层弹框响应）</li>
            <li><strong>Esc</strong>：关闭弹框</li>
          </ul>
        </Paragraph>
        <Paragraph type="secondary">
          搜索框支持 500ms 防抖、竞态保护（只处理最新请求）、唯一结果自动选中（已禁用）。
          加载中时失焦会等待搜索完成后再处理。
        </Paragraph>
      </Card>
    </div>
  );
}

export function pageConfig() {
  return {
    title: 'Org Components',
  };
}
