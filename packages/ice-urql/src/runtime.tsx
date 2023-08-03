import type { RuntimePlugin } from '@ice/runtime/types';
import React from 'react';
import { Provider } from 'urql';
import { RequestConfig } from "./types";
import { createUrqlInstance } from "./request";

const EXPORT_NAME = 'urqlConfig';
const runtime: RuntimePlugin = async ({appContext, addProvider}) => {
  const {appExport} = appContext;
  const exported = appExport?.[EXPORT_NAME];
  const requestConfig: RequestConfig = (typeof exported === 'function' ? exported() : exported) || {};
  if (Array.isArray(requestConfig)) {
    requestConfig.forEach((config) => {
      const instanceName = config.instanceName ? config.instanceName : 'default';
      if (instanceName) {
        createUrqlInstance(config, config.instanceName);
      }
    });
  } else {
    createUrqlInstance(requestConfig, requestConfig?.instanceName,);
  }
};

export default runtime;
