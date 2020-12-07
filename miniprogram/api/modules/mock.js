/*
 * @Descripttion:
 * @Author: pujianguo
 * @Date: 2020-12-07 17:56:57
 */

export const listMockNews = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      let count = 55
      let { offset, limit } = params
      let list = []
      for (let i = 0; i < limit; i++) {
        let index = offset + i + 1
        if (index <= count) {
          let item = Object.assign({}, newsData['data' + Math.floor(Math.random() * 5)])
          item.id = index
          list.push(item)
        }
      }
      resolve({ count: count, items: list })
    }, 1000)
  })
}

// const newGuid = () => {
//   let s4 = function () {
//     return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
//   }
//   return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' + s4() + '-' + s4() + s4() + s4()).toUpperCase()
// }

const newsData = {
  data0: {
    'datetime': '40分钟前',
    'article_type': 0,
    'title': 'uni-app行业峰会频频亮相，开发者反响热烈!',
    'source': 'DCloud',
    'comment_count': 639
  },
  data1: {
    'datetime': '一天前',
    'article_type': 1,
    'title': 'DCloud完成B2轮融资，uni-app震撼发布!',
    'image_url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
    'source': 'DCloud',
    'comment_count': 11395
  },
  data2: {
    'datetime': '一天前',
    'article_type': 2,
    'title': '中国技术界小奇迹：HBuilder开发者突破200万',
    'image_url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90',
    'source': 'DCloud',
    'comment_count': 11395
  },
  data3: {
    'article_type': 3,
    'image_list': [{
      'url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
      'width': 563,
      'height': 316
    }, {
      'url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90',
      'width': 641,
      'height': 360
    }, {
      'url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
      'width': 640,
      'height': 360
    }],
    'datetime': '5分钟前',
    'title': 'uni-app 支持使用 npm 安装第三方包，生态更趋丰富',
    'source': 'DCloud',
    'comment_count': 11
  },
  data4: {
    'datetime': '2小时前',
    'article_type': 4,
    'title': 'uni-app 支持原生小程序自定义组件，更开放、更自由',
    'image_url': 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
    'source': 'DCloud',
    'comment_count': 69
  }
}
