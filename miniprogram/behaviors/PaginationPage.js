/*
 * @Descripttion: 分页Page的构造方法
 * @Author: pujianguo
 * @Date: 2020-12-25 16:24:13
 */

const OriginPage = Page

const PaginationPage = (options = {}) => {
  const { data, state, onPullDownRefresh, onReachBottom } = options
  const mountOptions = {
    data: {
      isSearch: false, // 没有搜索的页面直接为false
      initLoading: true, // 初始化加载的标识
      query: {},
      list: [],
      isShowFooterLoading: false,
      isShowFooterNoMore: false,
      ...data,
    },
    state: {
      loading: false,
      currentPage: 0,
      pages: 0,
      size: 10,
      ...state,
    },
    // onLoad (...res) {
    //   this.refreshListData()
    //   onLoad && onLoad.apply(this, res)
    // },

    onPullDownRefresh () {
      if (onPullDownRefresh) { // 页面中重写
        onPullDownRefresh.apply(this)
      } else {
        !this.data.isSearch && this.refreshListData()
      }
    },
    onReachBottom () {
      if (onReachBottom) { // 页面中重写
        onReachBottom.apply(this)
      } else {
        !this.data.isSearch && this.getData()
      }
    },

    refreshListData () {
      this.state.currentPage = 0
      this.getData(true)
    },
    getData (isRefresh = false) {
      if (this.state.loading || (this.state.currentPage > 0 && this.state.currentPage >= this.state.pages)) {
        return
      }
      const query = Object.assign({
        offset: this.state.currentPage * this.state.size,
        limit: this.state.size,
      }, this.data.query)
      this.state.loading = true
      this.setFooter()
      wx.showNavigationBarLoading()
      const isShowRequestLoading = !this.data.initLoading && isRefresh
      this.getDataHandle(query, isShowRequestLoading).then(({ items, count }) => {
        let list = items
        if (!isRefresh) {
          list = this.data.list.concat(items)
        }
        this.state.currentPage = this.state.currentPage + 1
        this.state.pages = Math.ceil(count / this.state.size)
        this.setData({ list: list })
      }).catch(_ => {
        console.log('get page data err：', _)
      }).finally(_ => {
        if (this.data.initLoading) {
          this.setData({ initLoading: false })
        }
        this.state.loading = false
        this.setFooter()
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      })
    },

    setFooter () {
      let isShowFooterLoading = false
      let isShowFooterNoMore = false
      if (this.state.loading && this.state.currentPage > 0) {
        isShowFooterLoading = true
      }
      if (!this.state.loading && this.state.currentPage > 1 && this.state.currentPage === this.state.pages) {
        isShowFooterNoMore = true
      }
      this.setData({
        isShowFooterLoading,
        isShowFooterNoMore,
      })
    },
  }
  return OriginPage(Object.assign({}, options, mountOptions)) // 调用原生的Page构造函数
}

export default PaginationPage
