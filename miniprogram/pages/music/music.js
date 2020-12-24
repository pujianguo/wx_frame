import { cloudRequest } from '../../utils/request'

const getSongList = (query, loading) => {
  return cloudRequest({
    loading: loading,
    name: 'music',
    data: {
      ...query,
      $url: 'songs',
    },
  })
}

Page({
  data: {
    bannerList: [],

    // 分页相关
    list: [],
    refreshFlag: false,
    loadMoreFlag: false,
    initLoading: true,
    apiObj: {
      query: {},
      apiFun: getSongList,
      initItemFun: item => {
        return item
      },
    },
  },

  onLoad: function (options) {
    this.getBanner()
  },

  onPullDownRefresh: function () {
    this.setData({ refreshFlag: !this.data.refreshFlag })
  },

  onReachBottom: function () {
    this.setData({ loadMoreFlag: !this.data.loadMoreFlag })
  },

  onShareAppMessage: function () {},

  /** ********** methods ********** **/
  bindCloseInitLoading () {
    this.setData({ initLoading: false })
  },
  bindRefreshList (e) {
    console.log('list', e.detail.list[0])
    this.setData({ list: e.detail.list })
  },

  handlePlay (e) {
    console.log('play')
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
