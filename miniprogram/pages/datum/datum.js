import { listDatumMock } from '../../api/mock'

Page({
  data: {
    isSearch: false,
    currentSearchType: '',
    menuFixed: false,

    queryArea: {label: '全国',value: ''},
    queryProvince: {label: '全国',value: ''},
    queryCity: {label: '全国',value: ''},
    queryBank: {label: '全部银行',value: ''},
    queryCategory: {label: '资料分类',value: ''},
    areaList: [{label: '全国',value: ''}],
    bankList: [{label: '全部银行',value: ''}],
    categoryList: [{label: '资料分类',value: ''}],
    provinceList: [],
    cityList: [],

    // 分页相关
    list: [],
    refreshFlag: false,
    loadMoreFlag: false,
    initLoading: true,
    apiObj: {
      query: {},
      apiFun: listDatumMock,
      initItemFun: item => {
        item.hasGet = false
        return item
      }
    }
  },
  state: {
    menuTop: 0
  },

  onLoad: function (options) {
    this.getQueryData()
  },
  onShow: function () {
    // 设置menuTop
    if (this.state.menuTop === 0) {
      wx.createSelectorQuery().select('#menu').boundingClientRect(res => {
        this.state.menuTop = res.top
      }).exec()
    }
  },
  onPageScroll: function(event){
    if (!this.data.isSearch) {
      const isSticky = event.scrollTop >= this.state.menuTop
      if (isSticky !== this.data.menuFixed) {
        this.setData({ menuFixed: isSticky })
      }
    }
  },
  onPullDownRefresh: function () {
    if (!this.data.isSearch) {
      this.setData({refreshFlag: !this.data.refreshFlag})
    }
  },
  onReachBottom: function () {
    if (!this.data.isSearch) {
      this.setData({loadMoreFlag: !this.data.loadMoreFlag})
    }
  },
  onShareAppMessage: function () {
  },

  /** ********** methods ********** **/
  // 分页相关
  bindCloseInitLoading() {
    this.setData({initLoading: false})
  },
  bindRefreshList(e) {
    this.setData({list: e.detail.list})
  },

  getQueryData () {
    const areaList = [
      {label: '全国', value: ''}
    ]
    const bankList = [
      {label: '全部银行', value: ''},
      {label: '交通银行', value: 1},
      {label: '建设银行', value: 2},
      {label: '中国银行', value: 3},
      {label: '工商银行', value: 4},
      {label: '招商银行', value: 5}
    ]
    const categoryList = [
      {label: '全部分类', value: ''},
      {label: '笔试资料', value: 1},
      {label: '面试资料', value: 2},
      {label: '考情分析', value: 3}
    ]
    const provinceList = [
      {label: '全国', value: ''},
      {label: '北京', value: 1},
      {label: '天津', value: 2},
      {label: '河北', value: 3},
      {label: '山西', value: 4},
      {label: '内蒙古', value: 5},
      {label: '辽宁', value: 6},
      {label: '吉林', value: 7},
      {label: '江苏', value: 8},
      {label: '山西', value: 9},
      {label: '山东', value: 10},
      {label: '广东', value: 11},
      {label: '广西', value: 12},
      {label: '西藏', value: 13},
      {label: '甘肃', value: 14},
      {label: '青海', value: 15},

    ]
    const cityList = [
      {label: '西安', value: 1},
      {label: '铜川', value: 2},
      {label: '宝鸡', value: 3},
      {label: '咸阳', value: 4},
      {label: '渭南', value: 5},
      {label: '延安', value: 6},
      {label: '汉中', value: 7},
      {label: '榆林', value: 8},
      {label: '安康', value: 9},
      {label: '商洛', value: 10},
      {label: '西安', value: 11},
      {label: '铜川', value: 12},
      {label: '宝鸡', value: 13},
      {label: '咸阳', value: 14},
      {label: '渭南', value: 15},
      {label: '延安', value: 16},
    ]
    this.setData({
      areaList,
      bankList,
      categoryList,
      provinceList,
      cityList
    })
  },

  // 搜索相关
  openSearch (e) {
    console.log(this.state.menuTop)
    wx.pageScrollTo({
      scrollTop: this.state.menuTop,
      duration: 100
    });
    const { type } = e.currentTarget.dataset
    this.setData({
      menuFixed: true,
      isSearch: true,
      currentSearchType: type
    })
    setTimeout(() => {
    }, 150)
  },
  closeSearch(){
    // 回到搜索页
    wx.pageScrollTo({
      scrollTop: this.state.menuTop,
      duration: 100
    });
    this.setData({
      isSearch: false,
      currentSearchType: ''
    })
  },

  // 选择搜索选项
  selectBank(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      queryBank: this.data.bankList[index]
    })
    wx.vibrateShort()
    this.closeSearch()
  },
  selectCategory(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      queryCategory: this.data.categoryList[index]
    })
    wx.vibrateShort()
    this.closeSearch()
  },
  selectProvince(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      queryProvince: this.data.provinceList[index]
    })
  },
  selectCity(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      queryCity: this.data.cityList[index]
    })
    wx.vibrateShort()
    this.closeSearch()
  }
})
