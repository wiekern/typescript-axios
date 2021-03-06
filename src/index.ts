import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transfromRequest } from './helpers/data'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig) {
  return transfromRequest(config.data)
}

export default axios
