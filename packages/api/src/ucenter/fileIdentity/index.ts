import { paging } from '@knockout-js/ice-urql/request';
import { gql } from "../../gql/ucenter";
import { instanceName } from '../..';
import { FileIdentityOrder, FileIdentityWhereInput } from '../../gql/ucenter/graphql';


const fileIdentitiesQuery = gql(/* GraphQL */`query apiFileIdentities($first:Int, $orderBy: FileIdentityOrder,$where:FileIdentityWhereInput){
  fileIdentities(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      node{
        id,isDefault,tenantID,
        source{
          id,bucket,region,kind,endpoint,endpointImmutable,stsEndpoint,bucketURL
        }
      }
    }
  }
}`)

/**
 * 获取 FileIdentity 的分页接口
 * @param gather 分页参数,排序,过滤条件
 * @returns
 */
export async function getFileIdentitieList(gather: {
  current?: number;
  pageSize?: number;
  where?: FileIdentityWhereInput;
  orderBy?: FileIdentityOrder;
},) {
  const result = await paging(fileIdentitiesQuery, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1, {
    instanceName: instanceName.UCENTER,
    requestPolicy: "cache-first",
  });
  return result.data?.fileIdentities;
}



/**
 * 获取 filesource信息
 * @param filter 不填写默认获取default
 * @returns
 */
export async function getFileSource(filter?: {
  bucket?: string,
  endpoint?: string,
  bucketUrl?: string,
},) {
  const where: FileIdentityWhereInput = {}
  if (filter?.bucketUrl) {
    where.hasSourceWith = [{
      bucketURLContains: filter.bucketUrl
    }]
  } else if (filter?.endpoint && filter?.bucket) {
    where.hasSourceWith = [{
      endpoint: filter.endpoint,
      bucket: filter.bucket
    }]
  }

  const result = await getFileIdentitieList({
    where
  })

  if (result?.totalCount && result.edges) {
    if (Object.keys(where).length) {
      // 有过滤条件就取第一条
      return result.edges[0]?.node
    } else {
      // 无过滤条件就取 default
      return result.edges.find(edge => edge?.node?.isDefault)?.node
    }
  }
  return null
}
