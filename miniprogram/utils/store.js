/*
 * @Descripttion: 统一的本地存储
 * @Author: pujianguo
 * @Date: 2020-12-07 11:28:24
 */

const TOKEN = 'token'
const USERINFO = 'userinfo'

const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {}
}
const getStorage = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    return ''
  }
}
const rmStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {}
}
const clearStorage = () => {
  try {
    wx.clearStorageSync()
  } catch (e) {}
}

export default {
  // token
  setToken: value => setStorage(TOKEN, value),
  getToken: () => getStorage(TOKEN),
  rmToken: () => rmStorage(TOKEN),

  // userinfo
  setUserInfo: value => setStorage(USERINFO, value),
  getUserInfo: () => getStorage(USERINFO),
  rmUserInfo: () => rmStorage(USERINFO),

  // clear all
  clearStorage: () => clearStorage,
}
