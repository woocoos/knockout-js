import { defineConfig } from '@ice/app';
import store from '@ice/plugin-store';
import urqlPlugin from '@knockout-js/ice-urql';
import request  from "@ice/plugin-request";

export default defineConfig(() => ({
  plugins: [
    store(),
    request(),
    urqlPlugin(),
  ],
}));
