---
sidebar_label: LeavePrompt
---

本 Demo 演示用法。

```tsx preview
import { useState, useEffect } from "react";
import { Button } from "antd";
import { LeavePrompt, useLeavePrompt } from "@knockout-js/layout";
import { useLocation, useHistory } from "@docusaurus/router";

export default () => {
  const [show, setShow] = useState(false);
  // 目前在文档项目使用的是文档提供的useLocation
  const location = useLocation();
  const history = useHistory();

  const [checkLeave, setLeavePromptWhen] = useLeavePrompt();

  useEffect(() => {
    setLeavePromptWhen(!show);
  }, [show]);

  return (
    <LeavePrompt pathname={location.pathname}>
      <div>{show ? "当前刷新会拦截" : "当前刷新不拦截"}</div>
      <Button
        onClick={() => {
          setShow(!show);
        }}
      >
        切换是否来拦截
      </Button>
      <Button
        onClick={() => {
          if (checkLeave()) {
            history.push("/");
          }
        }}
      >
        返回首页
      </Button>
    </LeavePrompt>
  );
};
```

## Props

<ReactDocgenProps path="../src/components/leave-prompt/index.tsx"></ReactDocgenProps>

## Event

| 名称               | 参数                   | 描述                                           |
| ------------------ | ---------------------- | ---------------------------------------------- |
| checkLeave         | () => boolean          | 检测是否可以离开。true:可离开,false:被拦截     |
| setLeavePromptWhen | (when:boolean) => void | 主动设置是否可以离开。true:可离开,false:被拦截 |
