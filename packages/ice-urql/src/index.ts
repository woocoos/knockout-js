import type { Plugin } from '@ice/app/types';

const PLUGIN_NAME = '@knockout-js/ice-urql';

const plugin: Plugin = () => ({
  name: PLUGIN_NAME,
  setup: ({ generator }) => {
    generator.addExport({
      specifier: ["useQuery", "useMutation", "useSubscription", 'queryRequest', 'pagingRequest', 'mutationRequest', 'subscriptionRequest'],
      source: `${PLUGIN_NAME}/request`,
      type: false,
    });
  },
  runtime: `${PLUGIN_NAME}/runtime`,
});

export default plugin;
