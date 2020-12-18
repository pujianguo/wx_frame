const { showToast, showRequestLoading, hideRequestLoading } = require('../../../utils/func')

Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
  },
  data: {
    itemLock: false,
  },
  methods: {
    clickItem (e) {
      const { index } = e.currentTarget.dataset
      const item = this.data.list[index]
      if (item.hasGet) {
        wx.navigateTo({
          url: `/pages/datum-preview/datum-preview?id=${item.id}&title=${item.title}`,
        })
      }
    },
    clickBtn (e) {
      if (this.data.itemLock) {
        return
      }
      const { index } = e.currentTarget.dataset
      this.data.itemLock = true
      showRequestLoading('领取中')
      setTimeout(() => {
        hideRequestLoading()
        showToast('领取成功')
        this.data.itemLock = false
        const key = `list[${index}].hasGet`
        this.setData({
          [key]: true,
        })
        wx.navigateTo({ url: '/pages/mydatum/mydatum' })
      }, 300)
    },
  },
})
