import { filter, showModalInfo } from '../../../utils/func'
import { cloudRequest } from '../../../utils/request'

// miniprogram/pages/zhibo/dongqiudi/dongqiudi.js
Page({
  data: {
    list: [],
  },
  onLoad: function (options) {
    this.getData()
  },

  onShareAppMessage: function () {
  },
  onPullDownRefresh: function () {
    this.getData()
  },
  getRecentHour: function (n, t) {
    const now = t ? (new Date(t)) : new Date()
    now.setHours(now.getHours() + n)
    return filter('second', now)
  },
  getRecentDate: function (n, t) {
    const now = t ? (new Date(t)) : new Date()
    now.setDate(now.getDate() + n)
    return filter('second', now)
  },

  getData () {
    // const start = '2020-12-28 00:00:00'
    // 开始时间好像只能选日期，选时间没有作用
    const start = this.getRecentDate(-1)
    cloudRequest({
      loading: true,
      hideErrorInfo: true,
      name: 'zhibo',
      data: {
        $url: 'dongqiudi',
        type: 'all',
        start: start,
      },
    }).then(res => {
      console.log('res', res)
      this.setData({
        list: res.map(x => {
          x.time = filter('minute', x.start_play)
          return x
        }),
      })
    }).catch(err => {
      showModalInfo('获取失败', err.errMsg)
    }).finally(_ => {
      wx.stopPullDownRefresh()
    })
  },
})
