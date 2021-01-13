Page({
  data: {
    src: '',
  },
  state: {
    title: '',
    optionsStr: '',
  },

  onLoad: function (options) {
    // TODO: 模拟数据
    options = {
      id: 1,
      title: 'pdf文件',
      file: 'file=https://static.kaoyan365.cn/production/book/doc/1607053215271-f95bbae5-988c-4a96-8bab-19480fe022c4.pdf',
    }

    const previewPdfHtml = 'https://front-app.ekeguan.com/static/pdfjs/web/viewer.html'
    const { id, title, file } = options
    this.state.optionsStr = `id=${id}&title=${title}&file=${file}`
    const query = `title=${encodeURIComponent(title)}&file=${encodeURIComponent(file)}&downloadable=false&printable=false&openable=false&toolable=false`
    this.setData({
      src: `${previewPdfHtml}?${query}`,
    })
    if (title) {
      this.state.title = decodeURIComponent(title)
      wx.setNavigationBarTitle({ title: this.state.title })
    }
  },
  // 分享
  onShareAppMessage: function (options) {
    return {
      title: this.state.title,
      path: `/pages/datum-preview/datum-preview?${this.state.optionsStr}`,
      // imageUrl: '/images/datum/share_preview_pdf.jpg',
    }
  },

  /** ***** methods ***** **/
  bindMessage (e) {
    console.log('e', e)
  },
})
