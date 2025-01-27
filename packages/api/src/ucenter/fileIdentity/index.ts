import { query } from '@knockout-js/ice-urql/request';
import { gql } from "../../gql/ucenter";
import { instanceName } from '../..';

const orgFileIdentitiesQuery = gql(/* GraphQL */`query apiFileIdentities{
  orgFileIdentities{
    id,isDefault,tenantID,
    source{
      id,bucket,region,kind,endpoint,endpointImmutable,stsEndpoint,bucketURL
    }
  }
}`)


/**
 * 获取 FileIdentity 的分页接口
 * @param gather 分页参数,排序,过滤条件
 * @returns
 */
export async function getOrgFileIdentitieList() {
  const result = await query(orgFileIdentitiesQuery, {}, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  });
  return result.data?.orgFileIdentities ?? [];
}

/**
 * 获取 filesource信息
 * @param filter 不填写默认获取default  filter.bucketUrl 是和 bucketUrl进行匹配 传递的可能是全路径
 * @returns
 */
export async function getFileSource(filter?: {
  bucket?: string,
  endpoint?: string,
  bucketUrl?: string,
},) {
  const result = await getOrgFileIdentitieList()
  if (!filter) {
    return result[0]
  } else if (filter.bucket && filter.endpoint) {
    return result.find(fiItem => fiItem.source?.bucket === filter.bucket && fiItem.source?.endpoint === filter.endpoint)
  } else if (filter.bucketUrl) {
    return result.find(fiItem => filter.bucketUrl?.indexOf(fiItem.source?.bucketURL) == 0)
  } else {
    return result.find(fiItem => fiItem.isDefault)
  }
}
