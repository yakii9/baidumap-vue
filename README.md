# baidumap-vue

## 简介
工作中需要在vue中使用到百度地图，于是我自己封装了一个基于百度地图的组件，不仅支持显示基本的地图，还加入了绘制覆盖物，获取车辆导航、地址搜索的相关API。

## 注意事项
使用此插件前必须在全局引入百度地图的JS文件，及其几个常用插件（CurveLine、DistanceTool），如下所示：  
`<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak="></script>`  
`<script type="text/javascript" src="http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>`  
`<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>`  

## APIs
1. displayAllOverlayersInView () 根据覆盖物调整视口大小
2. addMarker (
      lng,
      lat,
      name,
      title,
      iconUrl,
      sContent = '暂无内容',
      multiDetails = '',
      iconWidth = 30,
      iconHeight = 30,
      imgClassInInfoWindow = 'infowindow-img'
    )   添加点状覆盖物
3. addPolyLine (
      locations,
      name,
      title,
      sContent = '暂无内容',
      multiDetails = '',
      highlightColor = 'yellow',
      option = { strokeColor: 'red', strokeWeight: 3, strokeOpacity: 0.5 },
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    )  添加折线
4. addPolygon (
      locations,
      name,
      title,
      sContent = '暂无内容',
      highlightColor = 'yellow',
      option = { strokeColor: 'blue', strokeWeight: 6, strokeOpacity: 0.5 },
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', border: 'none', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    )  添加多边形
5. addDriveRoute (
      name,
      locations,
      iconUrl,
      title = '暂无标题',
      sContent = '暂无内容',
      multiDetails = '',
      highlightColor = 'yellow',
      option = { strokeColor: '#228B22', strokeWeight: 6, strokeOpacity: 0.5 },
      iconWidth = 30,
      iconHeight = 30,
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', border: 'none', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    )   添加行车路线
6. addPath (
      name,
      data,
      editable = false,
      title = '暂无标题',
      sContent = '暂无内容',
      iconUrl = '',
      multiDetails = '',
      iconWidth = 30,
      iconHeight = 30,
      highlightColor = 'yellow',
      getPath = pathData => (pathData.path),
      getHoverTitle = () => (''),
      strokeColor = 'red',
      strokeStyle = 'solid',
      lineWidth = 3,
      dirArrowStyle = true,
      navStyle = { loop: true, speed: 1000000 },
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', border: 'none', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    )   添加弧线
7. initMap (center, zoomLevel = 11)  初始化地图，center为数组 [lng, lat]
8. getMap ()  返回map实例
9. removeAllOverlayers ()  清除所有覆盖物
10. reset ()  重制地图
11. generateSearchPanel (inputId, resultPanelId) 添加地址搜素的功能

## 使用方法
Template:  
`<baidu-map v-if="mapName === 'baidumap'" ref="map"/>`  
JS:  
`mounted () {  
  Vue.nextTick(() => {  
    this.$refs.map && this.$refs.map.initMap(  [116.397428, 39.90923])  
  })  
}`
