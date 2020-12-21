// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()
const musicBannerCollection = db.collection('music_banner')
const BASE_URL = ' http://neteasecloudmusicapi.zhaoboy.com'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  // app.use(async (ctx, next) => {
  //   console.log('进入全局中间件')
  //   ctx.data = {}
  //   ctx.data.openId = event.userInfo.openId
  //   await next()
  //   console.log('退出全局中间件')
  // })

  // 获取 banner
  app.router('banner', async (ctx, next) => {
    // ctx.body = await musicBannerCollection.get()
    //   const _ = db.command
    // await musicBannerCollection.where({
    //   targetId: _.gt(0),
    // }).remove()
    // const _ = db.command
    try {
      const res = await musicBannerCollection.get()
      ctx.body = res.data
    } catch (err) {
      ctx.body = err
    }
  })

  // 获取歌曲列表
  app.router('songs', async (ctx, next) => {
    // ctx.body = await cloud.database().collection('playlist')
    //   .skip(event.offset).limit(event.limit)
    //   .orderBy('createTime', 'desc').get()

  })

  // 获取歌曲详情
  app.router('detail', async (ctx, next) => {
    const infoUrl = `${BASE_URL}/song/detail?ids=${event.id}`
    const songUrl = `${BASE_URL}/song/url?ids=${event.id}`
    let [info, song] = await Promise.all([request(infoUrl), request(songUrl)])
    info = JSON.parse(info).songs[0]
    song = JSON.parse(song).data[0]
    ctx.body = {
      name: info.name,
      picUrl: info.al.picUrl,
      url: song.url,
      singer: info.ar[0].name,
      alName: info.al.name,
    }
  })

  return app.serve()
}
