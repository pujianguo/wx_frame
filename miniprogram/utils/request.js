/*
 * @Descripttion: 接口请求方法定义
 * @Author: pujianguo
 * @Date: 2020-12-07 09:38:53
 */
import storage from './store'
import { showRequestLoading, hideRequestLoading, showRequestError, checkTokenToLogin } from './func'
import config from '../config'

const httpRequest = function (url, method, data, needAuth = true, loading = true) {
  const header = {
    'Content-Type': 'application/json',
  }
  if (needAuth) {
    const token = storage.getToken()
    if (!token) {
      checkTokenToLogin()
      return Promise.reject(new Error('未登陆'))
    } else {
      header.Token = token
    }
  }
  loading && showRequestLoading()
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: res => {
        if (res.statusCode >= 400) {
          const msg = getResponseError(res)
          showRequestError(msg)
          reject(msg)
        } else {
          resolve(res.data)
        }
      },
      fail: e => reject(e),
      complete: () => {
        loading && hideRequestLoading()
      },
    })
  })
}

const getResponseError = res => {
  let msg = ''
  switch (res.statusCode) {
    case 400:
      msg = res.data.message
      break
    case 401:
      storage.rmToken()
      checkTokenToLogin()
      return
    default:
      if (res.data) {
        msg = res.data.message ? res.data.message : res.data
      } else {
        msg = '网络连接异常'
      }
      break
  }
  return msg
}

/** ******************** http请求相关 ******************** **/
export const _publicGet = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'GET', data, false, loading)
}
export const _get = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'GET', data, true, loading)
}
export const _publicPost = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'POST', data, false, loading)
}
export const _post = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'POST', data, true, loading)
}
export const _put = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'PUT', data, true, loading)
}
export const _delete = function (url, data = {}, loading = true) {
  const fullUrl = config.baseUrl + url
  return httpRequest(fullUrl, 'DELETE', data, true, loading)
}
