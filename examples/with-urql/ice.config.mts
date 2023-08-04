import { defineConfig } from '@ice/app';
import urqlPlugin from '@knockout-js/ice-urql';
import request  from "@ice/plugin-request";

export default defineConfig(() => ({
  plugins: [
    urqlPlugin(),
    request(),
  ],
}));
