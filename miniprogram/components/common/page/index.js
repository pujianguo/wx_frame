Component({
  properties: {
    apiObj: Object,
    refreshFlag: Boolean,
    loadMoreFlag: Boolean,
    size: {
      type: Number,
      value: 10
    }
  },
  data: {
    initLoading: true, // 初始化加载的标识
    list: [],
    loading: false,
    currentPage: 0,
    pages: 0,

    isShowFooterLoading: false,
    isShowFooterNoMore: false
  },

  observers: {
    refreshFlag () {
      this.refreshListData()
    },
    loadMoreFlag () {
      this.getData()
    }
  },

  attached() {
    this.data.initLoading = true
    this.refreshListData()
  },

  methods: {
    refreshListData () {
      this.data.currentPage = 0
      this.getData(true)
    },
    getData (isRefresh = false) {
      if (this.data.loading || (this.data.currentPage > 0 && this.data.currentPage >= this.data.pages)) {
        return
      }
      let query = Object.assign({}, this.data.apiObj.query, {
        offset: this.data.currentPage * this.data.size,
        limit: this.data.size
      })
      this.data.loading = true
      this.setFooter()
      wx.showNavigationBarLoading()
      const isShowRequestLoading = !this.data.initLoading && isRefresh
      this.data.apiObj.apiFun(query, isShowRequestLoading).then(res => {
        let list = res.items || []
        list = list.map(x => this.data.apiObj.initItemFun(x))
        if (!isRefresh) {
          list = this.data.list.concat(list)
        }
        this.data.list = list
        this.data.currentPage = this.data.currentPage + 1
        this.data.pages = Math.ceil(res.count / this.data.size)
        this.triggerEvent('refreshList', {list: list})
      }).catch(_ => {
      }).finally(_ => {
        if (this.data.initLoading) {
          this.data.initLoading = false
          this.triggerEvent('closeInitLoading')
        }
        this.data.loading = false
        this.setFooter()
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      })
    },

    setFooter () {
      let isShowFooterLoading = false
      let isShowFooterNoMore = false
      if (this.data.loading && this.data.currentPage > 0) {
        isShowFooterLoading = true
      }
      if (!this.data.loading && this.data.currentPage > 1 && this.data.currentPage === this.data.pages) {
        isShowFooterNoMore = true
      }
      this.setData({
        isShowFooterLoading,
        isShowFooterNoMore
      })
    }
  }
})
