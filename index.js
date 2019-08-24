const map = require('./index.vue')

uploader.install = function (Vue) {
  Vue.component('baidu-map-vue', map)
}

module.exports = {
  map: map
}
