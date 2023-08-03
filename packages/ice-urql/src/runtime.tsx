import type {RuntimePlugin, StaticRuntimePlugin} from '@ice/runtime/types';

const EXPORT_NAME = 'urqlConfig';
const runtime: StaticRuntimePlugin = async ({appContext}) => {
    const { appExport } = appContext;
    const exported = appExport[EXPORT_NAME];
    console.log(appExport);
};

export default runtime;
