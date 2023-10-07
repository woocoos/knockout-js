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
import { DictText } from "@knockout-js/layout";

export default () => {
  const dictCode = 'sex';
  const dataSource = [
    {id:"1",name:'男',code:'male',dict:{code:dictCode}},
    {id:"2",name:'女',code:'female',dict:{code:dictCode}},
    {id:"3",name:'保密',code:'confidentiality',dict:{code:dictCode}},
  ]
  return (<>
    <div>正常使用：
      <DictText 
        dictCode={dictCode} 
        value="male" 
      />
    </div>
    <div>用id来处理：
      <DictText 
      dictCode={dictCode} 
      value="2" 
      valueKey="id" />
    </div>
     <div>测试同时加载同一个数据3：
      <DictText 
        dictCode={dictCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据4：
      <DictText 
        dictCode={dictCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据5：
      <DictText 
        dictCode={dictCode} 
        value="male" 
      />
    </div>
    <div>TextProps type='success'：
      <DictText 
      dictCode={dictCode} 
      dataSource={dataSource} 
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
| dataSource | 外部出入数据源                    | AppDictItem[]     | ❌    | -      |
| valueKey   | 决定取AppDictItem的id或code字段   | 'id' &#124 'code' | ❌    | 'code' |

## DictSelect

用于字典选择组件

```tsx preview
import { useState } from "react";
import { Button } from "antd";
import { DictSelect } from "@knockout-js/layout";
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
 const dictCode = 'sex';
  const dataSource = [
    {id:"1",name:'男',code:'male',dict:{code:dictCode}},
    {id:"2",name:'女',code:'female',dict:{code:dictCode}},
    {id:"3",name:'保密',code:'confidentiality',dict:{code:dictCode}},
  ];

  return (<>
    <div>选择结果:{itemCode}</div>
    <DictSelect 
      dictCode={dictCode} 
      value={itemCode} 
      onChange={(value) => {
        setItemCode(value);
      }} 
    />
    <div>选择结果:{itemId}</div>
    <DictSelect 
      dictCode={dictCode} 
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
| dataSource  | 外部出入数据源                          | AppDictItem[]     | ❌    | -      |
| changeValue | 决定onChange取AppDictItem的id或code字段 | 'id' &#124 'code' | ❌    | 'code' |
