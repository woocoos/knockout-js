let stsApi = '/api-s3/oss/sts'

/**
 * 修改STS请求地址
 * @param api
 */
export function setStsApi(api: string) {
  stsApi = api
}

export function getStsApi() {
  return stsApi
}
