---
sidebar_label: 用法
---

本 Demo 演示一行文字的用法。

```jsx preview
import {OrgInput} from '@knockout-js/org';
import styles from './usage.module.css';
import React from 'react';

export default function App() {
  return (
    <div className={styles.usageContainer}>
      <OrgInput searchApi="http://localhost" />
    </div>
  )
}
```
