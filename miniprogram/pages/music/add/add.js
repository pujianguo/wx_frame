import { showToast, showToastSuccess } from '../../../utils/func'
import { cloudRequest } from '../../../utils/request'

Page({
  data: {
    searchValue: '慢慢喜欢你',
    searchList: [],
  },
  state: {
    addLoading: false,
  },

  onLoad: function (options) {
    this.onSearch()
  },

  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },

  onChange (e) {
    this.setData({ searchValue: e.detail })
  },
  onSearch () {
    if (this.data.searchValue === '') {
      showToast('请填写关键字')
      return
    }
    cloudRequest({
      loading: '搜索中...',
      name: 'music',
      data: {
        $url: 'search',
        keywords: this.data.searchValue,
      },
    }).then(res => {
      console.log('search res', res)
      this.setData({ searchList: res })
    }).catch(_ => {
      console.log('e', _)
    })
  },

  handleAdd (e) {
    if (this.state.addLoading) {
      return
    }
    const { id } = e.currentTarget.dataset
    this.state.addLoading = true
    cloudRequest({
      loading: '正在添加',
      name: 'music',
      data: {
        $url: 'add',
        id: id,
      },
    }).then(res => {
      console.log('res', res)
      showToastSuccess('添加成功')
    }).catch(_ => {
      console.log('e', _)
    }).finally(_ => {
      this.state.addLoading = false
    })
  },

})
