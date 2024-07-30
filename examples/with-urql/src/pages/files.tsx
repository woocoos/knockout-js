import { useState } from "react";
import { UploadAvatar, UploadTemp, UploadMultiple } from "@knockout-js/layout";



export default () => {

  // http://127.0.0.1:9000/test1/test/r6utsqowmb.jpg
  // http://qldevtest.oss-cn-shenzhen.aliyuncs.com/test/yfdrm6dyr78.jpg
  const [avatar, setAvatar] = useState<string | undefined>()

  // http://127.0.0.1:9000/test1/test/pkcfcpf9xs.txt
  const [temp, setTemp] = useState<string | undefined>()

  //
  const [list, setList] = useState<string[] | undefined>(['http://127.0.0.1:9000/test1/test/d8y6zjdyf2k.jpg', 'http://127.0.0.1:9000/test1/test/ivbs8cydz3.jpg'])

  return <>
    {/* accept 值 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept */}
    <h1>测试 组件 UploadAvatar</h1>
    <div>avatar: {avatar}</div>
    <UploadAvatar
      value={avatar}
      onChange={setAvatar}
      directory="test"
      accept="image/*"
    />

    <h1>测试 组件 UploadTemp</h1>
    <div>temp: {temp}</div>
    <UploadTemp
      value={temp}
      onChange={setTemp}
      directory="test"
      accept=".txt"
    />

    <h1>测试 组件 UploadMultiple</h1>
    <div>list: {list?.join(';')}</div>
    <UploadMultiple
      value={list}
      onChange={setList}
      directory="test"
      accept="image/*"
    />
  </>
}

