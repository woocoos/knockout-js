import { defineConfig } from '@ice/app';
import store from '@ice/plugin-store';
import urqlPlugin from '@knockout-js/ice-urql';
import request from "@ice/plugin-request";
import jsxPlus from '@ice/plugin-jsx-plus';
import auth from '@ice/plugin-auth';
import antd from '@ice/plugin-antd';

const minify = process.env.NODE_ENV === 'production' ? 'swc' : 'swc';

export default defineConfig(() => ({
  ssg: false,
  ssr: false,
  minify,
  codeSplitting: 'page',
  routes: {
    ignoreFiles: [
      '**/components/**',   // 添加此配置忽略components被解析成路由组件
    ],
  },
  plugins: [
    urqlPlugin(),
    request(),
    store(),
    jsxPlus(),
    antd({
      importStyle: false,
    }),
    auth(),
  ],
}));
