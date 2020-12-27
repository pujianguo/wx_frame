const { showToastSuccess, showModalInfo } = require('../../utils/func')
const { cloudRequest } = require('../../utils/request')

Page({
  data: {
    list: [],
  },

  onLoad: function (options) {
    this.getData()
  },

  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {

  },

  getData () {
    cloudRequest({
      loading: true,
      hideErrorInfo: true,
      name: 'zhibo',
      data: {
        $url: 'home',
        type: 'all',
      },
    }).then(res => {
      this.setData({ list: res })
    }).catch(err => {
      showModalInfo('获取失败', err.errMsg)
    })
  },
})
