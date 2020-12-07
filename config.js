/*
 * @Descripttion:
 * @Author: pujianguo
 * @Date: 2020-12-07 11:22:35
 */
// const ENV = process.env.VUE_APP_TITLE === 'pre' ? 'pre'
//   : process.env.NODE_ENV === 'production' ? 'production' : 'development'
const ENV = 'dev'

const dev = {
  env: 'dev',
  baseUrl: 'http://tapi.xxx.com',
  debug: true
}

const pre = {
  env: 'pre',
  baseUrl: 'http://tapi.xxx.com',
  debug: true
}

const prod = {
  env: 'prod',
  baseUrl: 'http://api.xxx.com',
  debug: false
}

const common = {
  loginPath: '/pages/login/login'
}

let config = {}
if (ENV === 'production') {
  config = Object.assign({}, common, prod)
} else if (ENV === 'pre') {
  config = Object.assign({}, common, pre)
} else {
  config = Object.assign({}, common, dev)
}

export default config
