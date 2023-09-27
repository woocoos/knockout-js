
import { query } from '@knockout-js/ice-urql/request';
import { gql } from "../../gql/ucenter";
import { instanceName } from '../..';
import { AppDictItem } from '../../gql/ucenter/graphql';

const dictListQuery = gql(/* GraphQL */`query apiAppDictByRefCode($refCodes: [String!]!){
  appDictByRefCode(refCodes:$refCodes){
    id,items{
      id,code,name,
      dict{
        code
      }
    }
  }
}`)

const dictItemListQuery = gql(/* GraphQL */`query apiAppDictItemByRefCode($refCode: String!){
  appDictItemByRefCode(refCode:$refCode){
    id,code,name,
    dict{
      code
    }
  }
}`)

/**
 * 获取字典列表接口
 * @param refCodes `appCode:appDictCode`
 * @returns
 */
export async function getDictItems(refCodes: string | string[]) {
  const dictItems: AppDictItem[] = []
  if (Array.isArray(refCodes)) {
    const result = await query(dictListQuery, {
      refCodes,
    }, {
      instanceName: instanceName.UCENTER,
      requestPolicy: "cache-first",
    });
    result.data?.appDictByRefCode?.forEach(item => {
      if (item?.items?.length) {
        dictItems.push(...item.items as AppDictItem[])
      }
    })
  } else {
    const result = await query(dictItemListQuery, {
      refCode: refCodes,
    }, {
      instanceName: instanceName.UCENTER,
      requestPolicy: "cache-first",
    });
    if (result.data?.appDictItemByRefCode.length) {
      result.data?.appDictItemByRefCode.forEach(item => {
        dictItems.push(item as AppDictItem);
      })

    }
  }
  return dictItems;
}
