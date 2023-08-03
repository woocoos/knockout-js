import { Outlet, defineDataLoader } from '@ice/runtime';
import {defineUrqlConfig} from '@knockout-js/ice-urql/types';
import { debugExchange, fetchExchange } from 'urql';
export default () => {
  return (
    <div>
      <h1>ICE 3.0 Layout</h1>
      <Outlet />
    </div>
  );
};

export function pageConfig() {
  return {
    title: 'Layout',
    meta: [
      {
        name: 'layout-color',
        content: '#f00',
      },
    ],
  };
}

export const dataLoader = defineDataLoader(async () => {
});

export const urqlConfig = defineUrqlConfig({
  url: 'https://trygql.formidable.dev/graphql/apq-weather',
  exchanges: [
    fetchExchange,
    debugExchange,
  ],
})
