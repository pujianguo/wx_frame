import { cloudRequest } from '../../utils/request'

Page({
  data: {
    bannerList: [],
  },

  onLoad: function (options) {
    this.getBanner()
  },

  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {},

  /** ********** methods ********** **/
  bindCloseInitLoading () {
    this.setData({ initLoading: false })
  },
  bindRefreshList (e) {
    console.log('bindRefreshList', e.detail.list)
    this.setData({ list: e.detail.list })
  },

  getBanner () {
    cloudRequest({
      loading: true,
      name: 'music',
      data: {
        $url: 'banner',
      },
    }).then(res => {
      this.setData({ bannerList: res })
    }).catch(err => {
      console.log('err', err)
    })
  },
})
