import type { Plugin } from '@ice/app/types';

const PLUGIN_NAME = '@knockout-js/ice-urql';

const plugin: Plugin = () => ({
  name: PLUGIN_NAME,
  setup: ({ generator }) => {
  },
  runtime: `${PLUGIN_NAME}/runtime`,
});

export default plugin;
