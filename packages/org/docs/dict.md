---
sidebar_label: 字典功能
sidebar_position: 1
---

# 字典功能

字典组件

本 Demo 演示用法。

**TODO:如果在`<ProTable ... />`上出现名称没转换,可能需要放一个不设置value的`<DictText dictCode="MsgCategory"  />`在同层来触发名称渲染**


## DictText

用于展示值组件

```tsx preview
import { useState } from "react";
import { Button } from "antd";
import { DictText } from "@knockout-js/org";

export default () => {
  const sexDictCode = 'sex';
  const dictCode = 'sexTest';
  const dataSource = [
    {id:"1",name:'男',code:'male',dict:{code:dictCode}},
    {id:"2",name:'女',code:'female',dict:{code:dictCode}},
    {id:"3",name:'保密',code:'confidentiality',dict:{code:dictCode}},
  ]
  return (<>
    <div>正常使用：
      <DictText 
        dictCode={sexDictCode} 
        value="male" 
      />
    </div>
    <div>用id来处理：
      <DictText 
      dictCode={sexDictCode} 
      value="2" 
      valueKey="id" />
    </div>
     <div>测试同时加载同一个数据3：
      <DictText 
        dictCode={sexDictCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据4：
      <DictText 
        dictCode={sexDictCode} 
        value="male" 
      />
    </div>
     <div>测试同时加载同一个数据5：
      <DictText 
        dictCode={sexDictCode} 
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
  const dictCode = 'sexTest';
  const dataSource = [
    {id:"1",name:'男',code:'male',dict:{code:dictCode}},
    {id:"2",name:'女',code:'female',dict:{code:dictCode}},
    {id:"3",name:'保密',code:'confidentiality',dict:{code:dictCode}},
    {id:"4",name:'test',code:'test',dict:{code:dictCode}},
  ];

  return (<>
    <div>选择结果:{itemCode}</div>
    <DictSelect 
      dictCode={sexDictCode} 
      value={itemCode} 
      onChange={(value) => {
        setItemCode(value);
      }} 
    />
    <div>选择结果:{itemId}</div>
    <DictSelect 
      dictCode={sexDictCode} 
      changeValue="id"
      value={itemId} 
      onChange={(value) => {
        setItemId(value);
      }} 
    />
    <div>选择结果:{itemId}</div>
    <DictSelect 
      dictCode={dictCode} 
      dataSource={dataSource}
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
