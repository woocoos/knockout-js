---
sidebar_label: 常见问题
---
# 常见问题

## CDN时候遇到异常

`Uncaught Error: Dynamic require of "react" or "antd" is not supported`

解决方法

```ts title=app.ts
/**
 * 以下两个方法需要如下限制
 * 
 * 限制1： 不能使用包含有require的加载。常见的是antd的包
 * 限制2:   isInIcestark()的使用。这个比较奇怪他们框架自带的包居然也会导致异常
 * 限制3:   不能使用状态管理的store
 *  */ 
export const dataLoader = defineDataLoader(async () => {
  ....
})

export const requestConfig = defineRequestConfig(() => {
  ...
});
```
