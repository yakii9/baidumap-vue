# baidumap-vue

## 简介
工作中需要在vue中使用到百度地图，于是我自己封装了一个基于百度地图的组件，不仅支持显示基本的地图，还加入了绘制覆盖物，获取车辆导航、地址搜索的相关API。

## 注意事项
使用此插件前必须在全局引入百度地图的JS文件，及其几个常用插件（CurveLine、DistanceTool），如下所示：
`<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak="></script>`
`<script type="text/javascript" src="http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>`
`<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>`
