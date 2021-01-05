import { filter, getRecentDate, showModalInfo } from '../../../utils/func'
import { cloudRequest } from '../../../utils/request'

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

  getData () {
    // const start = '2020-12-28 00:00:00'
    // 开始时间好像只能选日期，选时间没有作用
    const start = getRecentDate(-1)
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
