import type { RuntimePlugin } from '@ice/runtime/types';
import React from 'react';
import { Provider } from 'urql';
import { RequestConfig } from "./types";
import { createUrqlInstance, urqlInstances } from "./request.js";

const EXPORT_NAME = 'urqlConfig';

const runtime: RuntimePlugin = async ({ appContext, addProvider }) => {
  const { appExport } = appContext;
  const exported = appExport?.[EXPORT_NAME];
  const requestConfig: RequestConfig = (typeof exported === 'function' ? exported() : exported) || {};

  if (Array.isArray(requestConfig)) {
    requestConfig.forEach((config) => {
      createUrqlInstance(config);
    });
  } else {
    createUrqlInstance(requestConfig);
  }

  addProvider(({ children }) => (
    <Provider value={urqlInstances.default.client}>{children}</Provider>
  ))
};

export default runtime;
