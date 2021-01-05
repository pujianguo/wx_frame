import { listDatumMock } from '../../api/mock'
import PaginationPage from '../../behaviors/PaginationPage.js'

PaginationPage({
  data: {
    searchValue: '',
  },
  state: {
    isPage: false,
  },

  onLoad: function (options) {
    this.refreshListData()
  },
  onShareAppMessage: function () {
  },

  /** ********** methods ********** **/
  // 分页相关
  getDataHandle (query, loading) {
    return listDatumMock(query, loading).then(res => {
      let list = res.items || []
      list = list.map(x => {
        return x
      })
      return { items: list, count: res.count }
    })
  },
  pulling () {
    console.log('pulling')
  },
  refresh () {
    console.log('refresh')
  },
  restore () {
    console.log('restore')
  },
  abort () {
    console.log('abort')
  },

  onChange (e) {
    this.setData({ searchValue: e.detail })
  },
  onSearch () {
    console.log('value', this.data.searchValue)
  },
})
