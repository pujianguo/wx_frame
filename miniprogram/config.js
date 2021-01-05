/*
 * @Descripttion: 配置文件
 * @Author: pujianguo
 * @Date: 2020-12-07 11:22:35
 */
const ENV = 'dev'
// const accountInfo = wx.getAccountInfoSync()
// const ENV = accountInfo.miniProgram.envVersion

// 开发版
const dev = {
  env: 'dev',
  baseUrl: 'http://dev-api.xxx.com',
  debug: true,
}
// 测试版
const test = {
  env: 'test',
  baseUrl: 'http://test-api.xxx.com',
  debug: true,
}
// 预上线版
const pre = {
  env: 'pre',
  baseUrl: 'http://pre-api.xxx.com',
  debug: true,
}
// 正式版
const release = {
  env: 'release',
  baseUrl: 'http://api.xxx.com',
  debug: false,
}

const common = {
  loginPath: '/pages/login/login',
}

let config = {}
if (ENV === 'release') {
  config = Object.assign({}, common, release)
} else if (ENV === 'pre') {
  config = Object.assign({}, common, pre)
} else if (ENV === 'test') {
  config = Object.assign({}, common, test)
} else {
  config = Object.assign({}, common, dev)
}

export default config
