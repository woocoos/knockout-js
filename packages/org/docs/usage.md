---
sidebar_label: 用法
---

本 Demo 演示一行文字的用法。

```jsx preview
import OrgInput from '@knockout-js/org';
import styles from './usage.module.css';
import noop from './usage.js';
import React from 'react';
import {Button} from 'antd';

export default function App() {
  return (
    <div className={styles.usageContainer}>
      <Button onClick={noop}>点击</Button>
      <OrgInput />
    </div>
  )
}
```
