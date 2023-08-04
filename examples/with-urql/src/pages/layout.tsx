import { Outlet } from '@ice/runtime';
import { Provider } from "urql";
import { defaultClient } from "@knockout-js/ice-urql/esm/request";
export default () => {
  return (
    <div>
      <h1>ICE 3.0 Layout</h1>
      <Provider value={defaultClient()}>
        <Outlet/>
      </Provider>
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
