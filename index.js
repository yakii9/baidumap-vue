const Map = require('./index.vue')

Map.install = function (Vue) {
  Vue.component('baidu-map-vue', Map)
}

module.exports = Map
``