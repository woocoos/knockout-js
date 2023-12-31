---
sidebar_label: 字典功能
sidebar_position: 1
---

# 字典功能

字典组件

本 Demo 演示用法。

## DictText

用于展示值组件

```tsx preview
import { useState } from "react";
import { Button } from "antd";
import { DictText } from "@knockout-js/org";

export default () => {
  const sexDictCode = 'sex';
  const appCode = 'app1';
  const dictCode = 'sexTest';
  
  return (<>
    <div>正常使用：
      <DictText 
        dictCode={sexDictCode} 
        appCode={appCode}
        value="male" 
      />
    </div>
    <div>用id来处理：
      <DictText 
      dictCode={sexDictCode} 
      appCode={appCode} 
      value="2" 
      valueKey="id" />
    </div>
     <div>测试同时加载同一个数据3：
      <DictText 
        dictCode={sexDictCode} 
        appCode={appCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据4：
      <DictText 
        dictCode={sexDictCode} 
        appCode={appCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据5：
      <DictText 
        dictCode={sexDictCode} 
        appCode={appCode} 
        value="male" 
      />
    </div>
    <div>TextProps type='success'：
      <DictText 
      dictCode={dictCode}
      appCode={appCode}
      dataSource={[
        {id:"1",name:'男',code:'male',refCode:`${appCode}:${dictCode}`},
        {id:"2",name:'女',code:'female',refCode:`${appCode}:${dictCode}`},
        {id:"3",name:'保密',code:'confidentiality',refCode:`${appCode}:${dictCode}`},
      ]} 
      type="success"
      value="2" 
      valueKey="id" />
    </div>
    </>
  );
};
```

### Props

基于 ant [TextProps](https://ant-design.antgroup.com/components/typography-cn#typographytext)扩展

| 属性       | 描述                              | 类型              | 必填 | 默认值 |
| ---------- | --------------------------------- | ----------------- | ---- | ------ |
| value      | 值，支持AppDictItem的id或code字段 | string            | ❌    | -      |
| dictCode   | AppDict.code                      | string            | ✅    | -      |
| appCode    | 应用code默认取当前应用不需要传递  | string            | ❌    | -      |
| dataSource | 外部出入数据源                    | AppDictItem[]     | ❌    | -      |
| valueKey   | 决定取AppDictItem的id或code字段   | 'id' &#124 'code' | ❌    | 'code' |

## DictSelect

用于字典选择组件

```tsx preview
import { useState } from "react";
import { Button } from "antd";
import { DictSelect } from "@knockout-js/org";
import { createUrqlInstance } from "@knockout-js/ice-urql/request";
import { adminxApi } from "./assets/api";

createUrqlInstance([
  {
    instanceName: "default",
    url: adminxApi,
  }
]);

export default () => {
  const [itemId, setItemId] = useState()
  const [itemCode, setItemCode] = useState()
  const sexDictCode = 'sex';
  const appCode = 'app1';
  const dictCode = 'sexTest';

  return (<>
    <div>选择结果:{itemCode}</div>
    <DictSelect 
      dictCode={sexDictCode} 
      appCode={appCode} 
      value={itemCode} 
      onChange={(value) => {
        setItemCode(value);
      }} 
    />
    <div>选择结果:{itemId}</div>
    <DictSelect 
      dictCode={sexDictCode} 
      appCode={appCode} 
      changeValue="id"
      value={itemId} 
      onChange={(value) => {
        setItemId(value);
      }} 
    />
    <div>选择结果:{itemId}</div>
    <DictSelect 
      dictCode={dictCode} 
      appCode={appCode} 
      dataSource={ [
        {id:"1",name:'男',code:'male',refCode:`${appCode}:${dictCode}`},
        {id:"2",name:'女',code:'female',refCode:`${appCode}:${dictCode}`},
        {id:"3",name:'保密',code:'confidentiality',refCode:`${appCode}:${dictCode}`},
        {id:"4",name:'test',code:'test',refCode:`${appCode}:${dictCode}`},
      ]}
      changeValue="id"
      value={itemId} 
      onChange={(value) => {
        setItemId(value);
      }} 
    />
    </>
  );
};
```

### Props

基于 ant [SelectProps](https://ant-design.antgroup.com/components/select-cn#select-props)扩展

| 属性        | 描述                                    | 类型              | 必填 | 默认值 |
| ----------- | --------------------------------------- | ----------------- | ---- | ------ |
| dictCode    | AppDict.code                            | string            | ✅    | -      |
| appCode     | 应用code默认取当前应用不需要传递        | string            | ❌    | -      |
| dataSource  | 外部出入数据源                          | AppDictItem[]     | ❌    | -      |
| changeValue | 决定onChange取AppDictItem的id或code字段 | 'id' &#124 'code' | ❌    | 'code' |
