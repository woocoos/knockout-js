import { defineConfig } from '@ice/app';
import request from "@ice/plugin-request";
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';
import antd from '@ice/plugin-antd';
import jsxPlus from '@ice/plugin-jsx-plus';
import icestark from '@ice/plugin-icestark';
import urqlPlugin from '@knockout-js/ice-urql';

const NODE_ENV = process.env.NODE_ENV,
  minify = NODE_ENV === 'production' ? 'swc' : false;

export default defineConfig(() => ({
  ssg: false,
  minify,
  codeSplitting: 'page-vendors',
  compileDependencies: NODE_ENV === 'development' ? [/@urql\/*/, /@smithy\/core/] : true,
  routes: {
    ignoreFiles: [
      '**/components/**',   // 添加此配置忽略components被解析成路由组件
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    icestark({ type: 'child' }),
    urqlPlugin(),
    request(),
    store(),
    auth(),
    jsxPlus(),
    antd({
      importStyle: false,
    }),
  ],
  proxy: {
    "/api-s3": {
      target: "http://127.0.0.1:10070/",
      changeOrigin: true,
      pathRewrite: { [`^/api-s3`]: '' },
    }
  }
}));
