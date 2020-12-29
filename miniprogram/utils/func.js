/*
 * @Descripttion: 公共方法
 * @Author: pujianguo
 * @Date: 2020-12-07 10:21:50
 */
import config from '../config'
import store from './store'
import * as filterConst from '../filter/const'
import filterFunc from '../filter/func'

/**
 * 微信API Promise化
 * @param {wxApi} api 微信原生api
 * @return {Promise} promise对象
 * @example wxPromise(wx.getSetting)().then(res=>{})
 */
export const wxPromise = function (api) {
  return function (options = {}) {
    return new Promise((resolve, reject) => {
      api(Object.assign(options, {
        success: result => resolve(result),
        fail: error => reject(error),
      }))
    })
  }
}

/** *************** 提示框 这里做封装是为了可统一配置主题颜色等 *************** **/
/**
 * 普通的提示框
 * @param {String} title 标题
 * @param {String} content 内容
 * @param {Function} callback 点击确定后的回调
 * @return {void}
 */
export const showModal = (title, content, callback) => {
  wx.showModal({
    title: title,
    content: content,
    success: res => {
      if (res.confirm) {
        callback()
      }
    },
  })
}
/**
 * 提示框 只展示标题，内容，确认按钮，没有操作
 * 点击确认按钮没有操作，关闭提示框
 * @param {String} title 标题
 * @param {String} content 内容
 * @return {void}
 */
export const showModalInfo = (title, content) => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
  })
}
/**
 * 提示框 只展示内容，确认按钮
 * 点击确认按钮后跳转到指定页面
 * @param {String} text 提示内容
 * @param {String} url 跳转页面地址
 * @return {void}
 */
export const showWarningAndToUrl = (text, url) => {
  wx.showModal({
    content: text,
    showCancel: false,
    success () {
      wx.navigateTo({ url: url })
    },
  })
}
/**
 * 提示框 返回上一页
 * 展示内容 进入页面请求失败时会用到
 * 点击确认按钮后返回上一页
 * 点击取消按钮关闭提示框
 * @param {String} text 提示内容
 * @return {void}
 */
export const showWarningBack = text => {
  wx.showModal({
    content: text,
    success () {
      wx.navigateBack({ delta: 1 })
    },
  })
}
/**
 * 提示框 只展示确认按钮
 * 点击确认按钮执行回调函数
 * @param {String} text 提示内容
 * @param {Function} callback 点击确定后的回调
 * @return {void}
 */
export const showConfirmBack = (text, callback) => {
  wx.showModal({
    title: '提示',
    content: text,
    showCancel: false,
    success: () => {
      callback()
    },
  })
}

/** *************** Toast 轻提示 *************** **/
/**
 * 普通提示
 * @param {String} text 提示内容
 * @return {void}
 */
export const showToast = text => {
  wx.showToast({ title: text, icon: 'none', duration: 2000 })
}
/**
 * 成功提示
 * @param {String} text 提示内容
 * @return {void}
 */
export const showToastSuccess = text => {
  wx.showToast({ title: text, icon: 'success', duration: 2000 })
}
/**
 * 错误提示
 * @param {String} text 提示内容
 * @return {void}
 */
export const showToastError = text => {
  wx.showToast({ title: text, image: '/images/icons/error.png', duration: 2000 })
}

/** *************** http请求结果提示相关 *************** **/
/**
 * 打开 请求数据loading弹框
 * @param {Boolean|String} title Boolean值必为True，表示展示默认提示内容；String 为展示内容
 * @return {void}
 */
export const showRequestLoading = title => {
  if (!title || title === true) {
    title = '加载中'
  }
  wx.showLoading({ title: title })
}
/**
 * 关闭 请求数据loading弹框
 * @return {void}
 */
export const hideRequestLoading = () => {
  wx.hideLoading()
}
/**
 * 请求报错时的提示框
 * 没有取消按钮，点击确认按钮关闭
 * @param {String} msg 提示内容
 * @return {void}
 */
export const showRequestError = msg => {
  wx.showModal({
    content: msg,
    showCancel: false,
  })
}

/**
 * 检测是否登录，没有登录跳到登录页面
 * 会将当前页面信息带到path中，登录后可获取到 path 中的 page_to_redirect 进行跳转
 * @return {void}
 */
export const checkTokenToLogin = () => {
  if (!store.getToken()) {
    let path = config.loginPath
    const pages = getCurrentPages()
    if (pages.length) {
      const page = pages.pop()
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
/**
 * 深拷贝数据
 * @param {Object} data 要拷贝的原数据
 * @return {Object} 拷贝后的数据
 */
export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}
/**
 * 将const中的数据转化为下拉框选择时可用的数组
 * @param {Object} obj  const中的数据
 * @param {Object} firstItem 下拉框第一项，如：{value: '', label: '请选择xxx'}
 * @param {Boolean} isNumber key是否是number类型
 * @return {Array} 转换后的数据
 */
export const constDataToArray = (obj, firstItem = null, isNumber = false) => {
  const arr = []
  if (isNumber) {
    Object.getOwnPropertyNames(obj).forEach(k => {
      if (k !== 'default') {
        arr.push({ value: Number(k), label: obj[k] })
      }
    })
  } else {
    Object.getOwnPropertyNames(obj).forEach(k => {
      if (k !== 'default') {
        arr.push({ value: k, label: obj[k] })
      }
    })
  }
  firstItem && arr.unshift(firstItem)
  return arr
}
/**
 * filter过滤器
 * @param {String} filterName 过滤器名称
 * @param {Array} args 任意多个参数
 * @return {String|Number} 转换结果，一般结果为字符串或数字
 */
export const filter = (filterName, ...args) => {
  const data = filterConst[`${filterName}Data`]
  if (data) {
    return data[args[0]] || data.default
  }
  return filterFunc[filterName] ? filterFunc[filterName](...args) : ''
}

/** *************** 时间相关 *************** **/
/**
 * 获取最近几小时的时间
 * @param {number} n 最近n小时，负数表示向前
 * @param {Date|String} t 计算的开始时间，为空时默认取当前时间
 * @param {string} filterName 最后格式化的filter名称，取值为：month、date、minute、second
 * @return {String} 计算后的格式化时间
 */
export const getRecentHour = (n, t, filterName = 'second') => {
  const now = t ? (new Date(t)) : new Date()
  now.setHours(now.getHours() + n)
  return filter(filterName, now)
}
/**
 * 获取最近几天的时间
 * @param {number} n 最近n天，负数表示向前
 * @param {Date|String} t 计算的开始时间，为空时默认取当前时间
 * @param {string} filterName 最后格式化的filter名称，取值为：month、date、minute、second
 * @return {String} 计算后的格式化时间
 */
export const getRecentDate = (n, t, filterName = 'date') => {
  const now = t ? (new Date(t)) : new Date()
  now.setDate(now.getDate() + n)
  return filter(filterName, now)
}

/**
 * 检查是否需要更新小程序
 * @return {void}
 */
export function checkUpdateApp () {
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
            },
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            showCancel: false,
          })
        })
      }
    })
  }
}
