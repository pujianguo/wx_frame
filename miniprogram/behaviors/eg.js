/*
 * @Descripttion: Behavior示例
 * @Author: pujianguo
 * @Date: 2020-12-11 11:05:52
 */

export default Behavior({
  // 数据
  data: {
  },

  // 生命周期
  created: function () {
    console.log('[component] created')
  },
  attached: function () {
    console.log('[component] attached')
  },
  ready: function () {
    console.log('[component] ready')
  },
  moved: function () {
    console.log('[component] moved')
  },
  detached: function () {
    console.log('[component] detached')
  },

  // 方法
  methods: {
  }
})
