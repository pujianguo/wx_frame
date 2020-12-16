/*
 * @Descripttion: 公共方法
 * @Author: pujianguo
 * @Date: 2020-12-07 10:21:50
 */
import config from '../config'
import store from './store'

// 微信API Promise化
export const wxPromise = function(api) {
  return function(options = {}) {
    return new Promise((resolve, reject) => {
      api(Object.assign(options, {
        success: result => resolve(result),
        fail: error => reject(error)
      }))
    })
  }
}

/** *************** http请求结果提示相关 *************** **/
/* 提示框 普通的提示框，根据主题对颜色进行配置 */
export const showModal = (title, content, callback) => {
  wx.showModal({
    title: title,
    content: content,
    success: res => {
      if (res.confirm) {
        callback()
      }
    }
  })
}

/* 提示框 有地址跳转 */
export const showWarningAndToUrl = (text, url) => {
  wx.showModal({
    content: text,
    showCancel: false,
    success () {
      wx.navigateTo({ url: url })
    }
  })
}
/* 提示框 返回上一级  (进入页面请求失败时会用到))) */
export const showWarningBack = text => {
  wx.showModal({
    content: text,
    success () {
      wx.navigateBack({ delta: 1 })
    }
  })
}
/* 提示框 表单提交成功 */
export const showConfirmBack = (text, callback) => {
  wx.showModal({
    title: '提示',
    content: text,
    showCancel: false,
    success: () => {
      callback()
    }
  })
}
/* 提示框 无其他操作 */
export const showWarning = (text, title = '提示信息') => {
  wx.showModal({ title: title, content: text, showCancel: false })
}
/* 自动关闭弹出框 */
export const showToast = (text) => {
  wx.showToast({ title: text, icon: 'none', duration: 2000 })
}
export const showToastSuccess = (text) => {
  wx.showToast({ title: text, icon: 'success', duration: 2000 })
}
export const showToastError = (text) => {
  wx.showToast({ title: text, image: '/images/icons/error.png', duration: 2000 })
}

/* 打开 请求数据loading弹框 */
export const showRequestLoading = (title = '加载中') => {
  wx.showLoading({ title: title })
}
/* 关闭 请求数据loading弹框 */
export const hideRequestLoading = () => {
  wx.hideLoading()
}
/* 请求报错时的提示框 */
export const showRequestError = msg => {
  wx.showModal({
    content: msg,
    showCancel: false
  })
}


// 检测是否登录，没有登录跳到登录页面
export const checkTokenToLogin = () => {
  if (!store.getToken()) {
    let path = config.loginPath
    let pages = getCurrentPages()
    if (pages.length) {
      let page = pages.pop()
      let { route, options } = page
      options = Object.keys(options).map(key => {
        return key + '=' + options[key]
      }).join('&')
      path += `?page_to_redirect=${route}&${options}`
    }
    wx.redirectTo({ url: path })
  }
}

/** *************** 数据相关 *************** **/
// 拷贝数据
export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}

// 结果为字符串
export const formatDecimals = (value, decimals = 2) => {
  value = parseFloat(value)
  if (Number.isNaN(value)) {
    value = 0
  }
  return value.toFixed(decimals)
}
export const formatFloat = (value, decimals = 2) => {
  return parseFloat(formatDecimals(value, decimals))
}
export const formatInt = value => {
  value = parseInt(value)
  if (Number.isNaN(value)) {
    value = 0
  }
  return value
}
// js保留两位小数，自动补充零, 补0后转换成了字符串
export const formatMoney = value => {
  return formatDecimals(value)
}

/** *************** 时间相关 *************** **/
export const formatMonth = t => {
  if (t) {
    const {year, month} = getTimeItem(t)
    return `${year}-${month}`
  }
  return ''
}
export const formatDate = t => {
  if (t) {
    const {year, month, day} = getTimeItem(t)
    return `${year}-${month}-${day}`
  }
  return ''
}
export const formatMinute = t => {
  if (t) {
    const {year, month, day, hour, minute} = getTimeItem(t)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  return ''
}
export const formatSecond = t => {
  if (t) {
    const {year, month, day, hour, minute, second} = getTimeItem(t)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  return ''
}

// 检查是否需要更新小程序
export function checkUpdateApp() {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        console.log('res.hasUpdate====')
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '发现新版本',
            content: '升级至新版本，享受最新最全的活动内容',
            showCancel: false,
            success: function (res) {
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            showCancel: false
          })
        })
      }
    })
  }
}

const getTimeItem = t => {
  const date = new Date(t)
  return {
    year: date.getFullYear(),
    month: formatNumber(date.getMonth() + 1),
    day: formatNumber(date.getDate()),
    hour: formatNumber(date.getHours()),
    minute: formatNumber(date.getMinutes()),
    second: formatNumber(date.getSeconds())
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
