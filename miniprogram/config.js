/*
 * @Descripttion: 配置文件
 * @Author: pujianguo
 * @Date: 2020-12-07 11:22:35
 */
const accountInfo = wx.getAccountInfoSync()
const ENV = accountInfo.miniProgram.envVersion

// 开发版
const develop = {
  env: 'develop',
  baseUrl: 'http://develop-api.xxx.com',
  debug: true,
}
// 体验版
const trial = {
  env: 'trial',
  baseUrl: 'http://trial-api.xxx.com',
  debug: true,
}
// 正式版
const release = {
  env: 'release',
  baseUrl: 'http://release-api.xxx.com',
  debug: false,
}

const common = {
  loginPath: '/pages/login/login',
}

let config = {}
if (ENV === 'release') {
  config = Object.assign({}, common, release)
} else if (ENV === 'trial') {
  config = Object.assign({}, common, trial)
} else {
  config = Object.assign({}, common, develop)
}

export default config
