/*
 * @Descripttion: 接口请求方法定义
 * @Author: pujianguo
 * @Date: 2020-12-07 09:38:53
 */
import storage from './store'
import config from '../config'
import { showRequestLoading, hideRequestLoading, showRequestError, checkTokenToLogin } from './func'

/**
 * 云函数封装
 * @param {Object} data 参数对象，比云函数默认参数多了两个值：loading、hideErrorInfo
 * @param {Boolean|String} data.loading Boolean：是否展示加载框；String：加载框展示内容
 * @param {Boolean} data.hideErrorInfo 是否影藏错误提示，默认展示。设置为true，可自己处理错误
 *
 */
export const cloudRequest = function (data) {
  data.loading && showRequestLoading(data.loading)
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      ...data,
      success: res => {
        if (res.result.errCode) {
          !data.hideErrorInfo && showRequestError(res.result.errMsg)
          reject(res.result)
        } else {
          resolve(res.result)
        }
      },
      fail: e => {
        !data.hideErrorInfo && showRequestError(e.errMsg)
        reject(e)
      },
      complete: () => {
        data.loading && hideRequestLoading()
      },
    })
  })
}

/**
 * 请求接口方法
 * @param {Object} params 参数对象，可结构为以下参数
 * @param {String} url 接口地址
 * @param {String} method http方法
 * @param {Object} data 请求参数
 * @param {Boolean|String} loading Boolean：是否展示加载框；String：加载框展示内容
 * @param {Boolean} showErrorInfo 是否展示错误提示，默认展示
 * @param {Boolean} needAuth 是否需要校验token，默认需要
 * @return {Promise} Promise对象
 */
const httpRequest = function (params) {
  const { url, method, data, loading, showErrorInfo, needAuth } = Object.assign({
    showErrorInfo: true,
    needAuth: true,
  }, params)
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
  loading && showRequestLoading(loading)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: res => {
        if (res.statusCode >= 400) {
          const msg = getResponseError(res)
          showErrorInfo && showRequestError(msg)
          reject(msg)
        } else {
          resolve(res.data)
        }
      },
      fail: e => {
        showErrorInfo && showRequestError(e)
        reject(e)
      },
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
export const _publicGet = function (url, data = {}, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'GET', needAuth: false })
}
export const _get = function (url, data = {}, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'GET' })
}
export const _publicPost = function (url, data, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'POST', needAuth: false })
}

export const _post = function (url, data = {}, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'POST' })
}
export const _put = function (url, data = {}, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'PUT' })
}
export const _delete = function (url, data = {}, loading = true, showErrorInfo = true) {
  url = config.baseUrl + url
  return httpRequest({ url, data, loading, showErrorInfo, method: 'DELETE' })
}
