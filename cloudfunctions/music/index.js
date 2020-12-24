// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()
const musicBannerCollection = db.collection('music_banner')
const musicSongCollection = db.collection('music_song')
const BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com'

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
    try {
      const res = await musicBannerCollection.get()
      ctx.body = res.data
    } catch (err) {
      ctx.body = err
    }
  })

  // 搜索歌曲
  app.router('search', async (ctx, next) => {
    const res = await request({
      uri: `${BASE_URL}/search`,
      qs: {
        keywords: event.keywords,
      },
    }).then(res => {
      res = JSON.parse(res)
      if (res.code === 200) {
        const songs = res.result.songs.slice(0, 50).map(x => {
          return {
            id: x.id,
            name: x.name,
            album: x.album.name,
            singer: x.artists[0].name,
          }
        })
        return songs
      } else {
        // 错误格式保持和微信报错一致
        return { errCode: -1, errMsg: '获取数据失败' }
      }
    }).catch(_ => {
      return { errCode: -1, errMsg: '网络异常' }
    })
    ctx.body = res
  })

  // 添加歌曲
  app.router('add', async (ctx, next) => {
    try {
      let song = await musicSongCollection.where({
        id: event.id,
      }).get()
      if (song.data.length) {
        ctx.body = {
          errCode: -1,
          errMsg: '该歌曲已存在',
        }
        return
      }
      song = await getMusicDetail(event.id)
      ctx.body = await musicSongCollection.add({
        data: {
          ...song,
          createTime: db.serverDate(),
        },
      })
    } catch (err) {
      ctx.body = err
    }
  })

  // 获取歌曲列表
  app.router('songs', async (ctx, next) => {
    try {
      const countResult = await musicSongCollection.count()
      const res = await musicSongCollection
        .skip(event.offset)
        .limit(event.limit)
        .orderBy('createTime', 'desc').get()
      ctx.body = {
        count: countResult.total,
        items: res.data,
      }
    } catch (err) {
      ctx.body = err
    }
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

async function getMusicDetail (id) {
  // 获取数据
  const infoUrl = `${BASE_URL}/song/detail?ids=${id}`
  const songUrl = `${BASE_URL}/song/url?id=${id}`
  return Promise.all([request(infoUrl), request(songUrl)]).then(([res1, res2]) => {
    res1 = JSON.parse(res1)
    res2 = JSON.parse(res2)
    if (res1.code === 200 && res2.code === 200) {
      const info = res1.songs[0]
      const song = res2.data[0]
      return {
        id: id,
        name: info.name,
        album: info.al.name,
        singer: info.ar[0].name,
        picUrl: info.al.picUrl,
        url: song.url,
      }
    } else {
      return { errCode: -1, errMsg: '获取数据失败' }
    }
  }).catch(_ => {
    return { errCode: -1, errMsg: '网络异常' }
  })
}
