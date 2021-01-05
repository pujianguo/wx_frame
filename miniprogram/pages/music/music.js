import { cloudRequest } from '../../utils/request'
import PaginationPage from '../../behaviors/PaginationPage.js'
import store from '../../utils/store'
// import store from '../../utils/store'

PaginationPage({
  data: {
    bannerList: [],
  },

  onLoad: function (options) {
    this.getBanner()
    this.refreshListData()
  },

  onShareAppMessage: function () {},

  /** ********** methods ********** **/
  // 分页相关
  getDataHandle (query, loading) {
    return cloudRequest({
      loading: loading,
      name: 'music',
      data: {
        ...query,
        $url: 'songs',
      },
    }).then(res => {
      // return { items: res.items, count: res.count }
      return res
    })
  },

  handlePlay (e) {
    const id = e.currentTarget.dataset.id
    store.setMusicList(this.data.list.map(x => x.id))
    wx.navigateTo({
      url: '/pages/music/play/play?id=' + id,
    })
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
