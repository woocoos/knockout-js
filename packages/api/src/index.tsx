import CryptoJS from 'crypto-js';
export * from './gql/ucenter';
export * from './gql/ucenter/graphql';
export * from './ucenter/index';

/**
 * get global id by type and id, it is used for relay node query.
 * @param type graphql schema type
 * @param id
 * @returns string
 */
export const gid = (type: string, id: string | number) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${type}:${id}`));
};

/**
 * parse gid from base64 string to utf8 string
 * @param gid
 * @returns string 'type:id'
 */
export const parseGid = (gid: string) => {
  return CryptoJS.enc.Base64.parse(gid).toString(CryptoJS.enc.Utf8);
};
