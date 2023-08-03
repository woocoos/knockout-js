import type { Plugin } from '@ice/app/types';

interface PluginUrqlOptions {}
const PLUGIN_NAME = '@knockout-js/ice-urql';
const plugin: Plugin<PluginUrqlOptions | void> = () => ({
  name: PLUGIN_NAME,
  setup: (pluginAPI) => {
    console.log(pluginAPI)
  },
  runtime: `${PLUGIN_NAME}/runtime`,
  staticRuntime: true,
  keepExports: ['urqlConfig'],
});

export default plugin;
