import { query } from '@knockout-js/ice-urql/request';
import { gql } from "../../gql/ucenter";
import { instanceName } from '../..';


const fileIdentitiesQuery = gql(/* GraphQL */`query apiFileIdentities{
  fileIdentities{
    id,isDefault,tenantID,
    source{
      id,bucket,region,kind,endpoint,stsEndpoint,bucketurl
    }
  }
}`)

/**
 * 获取 filesource信息
 * @param filter 不填写默认获取default
 * @returns
 */
export async function getFileSource(filter?: {
  bucket: string,
  endpoint: string
}) {
  const result = await query(fileIdentitiesQuery, {
  }, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  });

  if (result.data?.fileIdentities.length) {
    if (filter) {
      const filterData = result.data?.fileIdentities.find(item => item.source.bucket == filter.bucket && item.source.endpoint == filter.endpoint);
      if (filterData) {
        return filterData
      }
    }
    return result.data?.fileIdentities.find(item => item.isDefault);
  }
  return null
}
