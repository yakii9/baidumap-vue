<template>
  <div id="container"></div>
</template>

<script>
const G = id => {
  return document.getElementById(id)
}

export default {
  name: 'baidumap',
  data () {
    return {
      map: null,
      showingLayers: [],
      showingMarkers: [],
      showingPolylines: [],
      showingPolygons: [],
      showingRoutes: [],
      showingPathes: [],
      tools: {
        distanceTool: undefined
      }
    }
  },
  methods: {
    displayAllOverlayersInView () {
      let allObjs = []
      this.showingMarkers.forEach(item => {
        allObjs = allObjs.concat(item.points)
      })
      this.showingPolylines.forEach(item => {
        allObjs = allObjs.concat(item.points)
      })
      this.showingPolygons.forEach(item => {
        allObjs = allObjs.concat(item.points)
      })
      this.showingPathes.forEach(item => {
        allObjs = allObjs.concat(item.points)
      })
      this.map.setViewport(allObjs)
    },
    addMarker (
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
    ) {
      if (!name) {
        return false
      }

      const infoWindowOpts = {
        width: 320,
        title: '<h4>' + title + '</h4>'
      }

      const point = new window.BMap.Point(lng, lat)
      const infoWindow = new window.BMap.InfoWindow(`${multiDetails}<br>${sContent}`, infoWindowOpts)
      const myIcon = new window.BMap.Icon(iconUrl, new window.BMap.Size(iconWidth, iconHeight))
      const marker = new window.BMap.Marker(point, { icon: myIcon })

      marker.addEventListener('click', function () {
        this.openInfoWindow(infoWindow)
        document.getElementById(imgClassInInfoWindow) && (document.getElementById(imgClassInInfoWindow).onload = () => {
          infoWindow.redraw()
        })
      })
      marker.setTitle(title)

      marker.addEventListener('mouseover', function () {
        marker.setAnimation(window.BMAP_ANIMATION_BOUNCE)
      })

      marker.addEventListener('mouseout', function () {
        marker.setAnimation()
      })

      const payload = {
        lng,
        lat,
        name,
        title,
        iconUrl,
        content: sContent,
        obj: marker,
        points: [point]
      }

      const idx = this.showingMarkers.findIndex(marker => {
        if (marker.name === name) {
          return true
        }

        return false
      })

      if (idx > -1) {
        this.showingMarkers[idx] = payload
      }

      if (idx < 0) {
        this.map.addOverlay(marker)
        this.showingMarkers.push(payload)
      }

      return payload
    },
    addPolyLine (
      locations,
      name,
      title,
      sContent = '暂无内容',
      multiDetails = '',
      highlightColor = 'yellow',
      option = { strokeColor: 'red', strokeWeight: 3, strokeOpacity: 0.5 },
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    ) {
      if (!name) {
        return false
      }

      if (!locations) {
        return null
      }

      const infoWindowOpts = {
        width: 320,
        title: '<h4>' + title + '</h4>'
      }

      const infoWindow = new window.BMap.InfoWindow(`${multiDetails}<br>${sContent}`, infoWindowOpts)

      const points = locations.map(location => (new window.BMap.Point(location.lng, location.lat)))

      const polyline = new window.BMap.Polyline(points, option)

      polyline.addEventListener('click', function (e) {
        this.getMap().openInfoWindow(infoWindow, e.point)
        document.getElementById(imgClassInInfoWindow) && (document.getElementById(imgClassInInfoWindow).onload = () => {
          infoWindow.redraw()
        })
      })

      const opts = {
        position: polyline.getBounds().getCenter(),
        offset: new window.BMap.Size(30, -30)
      }

      const lineLabel = new window.BMap.Label(title, opts)
      lineLabel.setStyle(labelStyle)

      const originColorOfPolyline = polyline.getStrokeColor()
      polyline.addEventListener('mouseover', function (e) {
        this.setStrokeColor(highlightColor)
        this.getMap().addOverlay(lineLabel)
        lineLabel.setPosition(e.point)
      })

      polyline.addEventListener('mouseout', function () {
        this.setStrokeColor(originColorOfPolyline)
        this.getMap().removeOverlay(lineLabel)
      })

      const payload = {
        locations,
        name,
        title,
        content: sContent,
        highlightColor,
        obj: polyline,
        points
      }

      const idx = this.showingPolylines.findIndex(polyline => {
        if (polyline.name === name) {
          return true
        }

        return false
      })

      if (idx > -1) {
        this.showingPolylines[idx] = payload
      }

      if (idx < 0) {
        this.map.addOverlay(polyline)
        this.showingPolylines.push(payload)
      }

      return payload
    },
    addPolygon (
      locations,
      name,
      title,
      sContent = '暂无内容',
      highlightColor = 'yellow',
      option = { strokeColor: 'blue', strokeWeight: 6, strokeOpacity: 0.5 },
      labelStyle = { color: '#FFFFFF', fontSize: '12px', lineHeight: '20px', background: '#1BA2E6', border: 'none', fontFamily: '微软雅黑' },
      imgClassInInfoWindow = 'infowindow-img'
    ) {
      if (!name) {
        return false
      }

      if (!locations) {
        return null
      }

      const infoWindowOpts = {
        width: 320,
        title: '<h4>' + title + '</h4>'
      }

      const infoWindow = new window.BMap.InfoWindow(sContent, infoWindowOpts)

      const points = locations.map(location => (new window.BMap.Point(location[0], location[1])))

      const polygon = new window.BMap.Polygon(points, option)

      polygon.addEventListener('click', function (e) {
        this.getMap().openInfoWindow(infoWindow, e.point)
        document.getElementById(imgClassInInfoWindow) && (document.getElementById(imgClassInInfoWindow).onload = () => {
          infoWindow.redraw()
        })
      })

      const opts = {
        position: polygon.getBounds().getCenter(),
        offset: new window.BMap.Size(30, -30)
      }

      const gonLabel = new window.BMap.Label(title, opts)
      gonLabel.setStyle(labelStyle)

      const originColorOfPolygon = polygon.getFillColor()
      polygon.addEventListener('mouseover', function (e) {
        this.getMap().addOverlay(gonLabel)
        gonLabel.setPosition(e.point)
        this.setFillColor(highlightColor)
      })

      polygon.addEventListener('mouseout', function () {
        this.setFillColor(originColorOfPolygon)
        this.getMap().removeOverlay(gonLabel)
      })

      const payload = {
        locations,
        name,
        title,
        content: sContent,
        highlightColor,
        obj: polygon,
        points
      }

      const idx = this.showingPolygons.findIndex(polygon => {
        if (polygon.name === name) {
          return true
        }

        return false
      })

      if (idx > -1) {
        this.showingPolygons[idx] = payload
      }

      if (idx < 0) {
        this.map.addOverlay(polygon)
        this.showingPolygons.push(payload)
      }

      return payload
    },
    addDriveRoute (
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
    ) {
      if (!name) {
        return false
      }

      const idx = this.showingRoutes.findIndex(route => (route.name === name))
      if (idx > -1) {
        return false
      }

      const startLocation = locations[0]
      const endLocation = locations[1]

      const startPoint = new window.BMap.Point(startLocation.lng, startLocation.lat)
      const endPoint = new window.BMap.Point(endLocation.lng, endLocation.lat)

      const icon = new window.BMap.Icon(iconUrl, new window.BMap.Size(iconWidth, iconHeight), {
        imageOffset: new window.BMap.Size(0, 0)
      })

      const run = () => {
        const drivingRoute = new window.BMap.DrivingRoute(this.map, { renderOptions: { map: this.map, autoViewport: true } })
        drivingRoute.search(startPoint, endPoint)

        drivingRoute.setSearchCompleteCallback(() => {
          const pts = drivingRoute.getResults().getPlan(0).getRoute(0).getPath()
          drivingRoute.clearResults()

          const infoWindowOpts = {
            width: 320,
            title: '<h4>' + title + '</h4>'
          }

          const infoWindow = new window.BMap.InfoWindow(`${multiDetails}<br>${sContent}`, infoWindowOpts)

          const points = pts

          const polyline = new window.BMap.Polyline(points, option)

          polyline.addEventListener('click', function (e) {
            this.getMap().openInfoWindow(infoWindow, e.point)
            document.getElementById(imgClassInInfoWindow) && (document.getElementById(imgClassInInfoWindow).onload = () => {
              infoWindow.redraw()
            })
          })

          const options = {
            position: polyline.getBounds().getCenter(),
            offset: new window.BMap.Size(30, -30)
          }

          const lineLabel = new window.BMap.Label(title, options)
          lineLabel.setStyle(labelStyle)

          const originColorOfPolyline = polyline.getStrokeColor()
          polyline.addEventListener('mouseover', function (e) {
            this.setStrokeColor(highlightColor)
            this.getMap().addOverlay(lineLabel)
            lineLabel.setPosition(e.point)
          })

          polyline.addEventListener('mouseout', function () {
            this.setStrokeColor(originColorOfPolyline)
            this.getMap().removeOverlay(lineLabel)
          })

          const numberOfPaths = pts.length

          const iconMarker = new window.BMap.Marker(pts[0], { icon })

          const payload = {
            name,
            startLocation,
            endLocation,
            iconUrl,
            points: [startPoint, endPoint]
          }

          const idx = this.showingRoutes.findIndex(r => (r.name === name))

          if (idx < 0) {
            this.map.addOverlay(polyline)
            this.map.addOverlay(iconMarker)
            this.showingRoutes.push(payload)
          }

          const resetTime = 10000 / numberOfPaths
          let i = 0
          const resetMkPoint = () => {
            iconMarker.setPosition(pts[i])
            if (i < numberOfPaths) {
              setTimeout(() => {
                i++
                resetMkPoint()
              }, resetTime)
            } else {
              i = 0
              resetMkPoint()
            }
          }
          setTimeout(() => {
            resetMkPoint()
          }, resetTime)

          setTimeout(() => {
            this.displayAllOverlayersInView()
          }, 120)
        })
      }
      run()
    },
    addPath (
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
    ) {
      if (!name) {
        return false
      }

      if (!data || !data.path) {
        return
      }

      this.map.enableScrollWheelZoom()
      const points = data.path.map(location => (new window.BMap.Point(location.lng, location.lat)))
      const curve = new window.BMapLib.CurveLine(points, { strokeColor: strokeColor, strokeStyle: strokeStyle, strokeWeight: lineWidth, strokeOpacity: 0.5 })

      const infoWindowOpts = {
        width: 320,
        title: '<h4>' + title + '</h4>'
      }

      const infoWindow = new window.BMap.InfoWindow(`${multiDetails}<br>${sContent}`, infoWindowOpts)
      curve.addEventListener('click', function (e) {
        this.getMap().openInfoWindow(infoWindow, e.point)
        document.getElementById(imgClassInInfoWindow) && (document.getElementById(imgClassInInfoWindow).onload = () => {
          infoWindow.redraw()
        })
      })

      const opts = {
        position: points[0],
        offset: new window.BMap.Size(20, -20)
      }

      const label = new window.BMap.Label(title, opts)
      label.setStyle(labelStyle)

      const originColor = curve.getStrokeColor()
      curve.addEventListener('mouseover', function (e) {
        this.setStrokeColor(highlightColor)
        this.getMap().addOverlay(label)
        label.setPosition(e.point)
      })

      curve.addEventListener('mouseout', function () {
        this.setStrokeColor(originColor)
        this.getMap().removeOverlay(label)
      })

      const icon = new window.BMap.Icon(iconUrl, new window.BMap.Size(iconWidth, iconHeight), {
        imageOffset: new window.BMap.Size(0, 0)
      })

      const run = () => {
        const pts = curve.getPath()
        const numberOfPaths = pts.length

        const iconMarker = new window.BMap.Marker(pts[0], { icon })

        const payload = {
          name,
          path: data.path,
          obj: curve,
          points
        }

        const idx = this.showingPathes.findIndex(path => (path.name === name))

        if (idx > -1) {
          this.showingPathes[idx] = payload
        }

        if (idx < 0) {
          this.map.addOverlay(curve)
          editable && curve.enableEditing()
          this.showingPathes.push(payload)
          this.map.addOverlay(iconMarker)
        }

        const resetTime = 10000 / numberOfPaths
        let i = 0
        const resetMkPoint = () => {
          iconMarker.setPosition(pts[i])
          if (i < numberOfPaths) {
            setTimeout(() => {
              i++
              resetMkPoint()
            }, resetTime)
          } else {
            i = 0
            resetMkPoint()
          }
        }
        setTimeout(() => {
          resetMkPoint()
        }, resetTime)
      }

      run()
    },
    initMap (center, zoomLevel = 11) {
      const point = new window.BMap.Point(center[0] || 116.397428, center[1] || 39.90923)

      if (this.map) {
        this.map.centerAndZoom(point, zoomLevel)
      }

      const map = new window.BMap.Map('container')
      map.centerAndZoom(point, zoomLevel)
      map.enableScrollWheelZoom(true)

      map.addControl(new window.BMap.NavigationControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }))
      map.addControl(new window.BMap.ScaleControl())
      map.addControl(new window.BMap.OverviewMapControl())
      map.addControl(new window.BMap.MapTypeControl({ anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT }))

      this.map = map
      this.tools.distanceTool = new window.BMapLib.DistanceTool(map)
    },
    switchDistanceTool (isOpen) {
      if (isOpen) {
        this.tools.distanceTool.open()
        return true
      }

      this.tools.distanceTool.close()
    },
    getMap () {
      return this.map
    },
    removeAllOverlayers () {
      this.map.clearOverlays()
      this.showingLayers = []
      this.showingMarkers = []
      this.showingPolylines = []
      this.showingPolygons = []
      this.showingRoutes = []
      this.showingPathes = []
    },
    reset () {
      this.map.reset()
    },
    generateSearchPanel (inputId, resultPanelId) {
      const map = this.map
      const ac = new window.BMap.Autocomplete({
        'input': inputId,
        'location': map
      })

      ac.addEventListener('onhighlight', e => {
        let str = ''
        let _value = e.fromitem.value
        let value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        G(resultPanelId).innerHTML = str
      })

      let myValue
      ac.addEventListener('onconfirm', e => {
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        G(resultPanelId).innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

        this.setPlace(myValue)
      })
    },
    setPlace (myValue) {
      this.map.clearOverlays()
      const myFun = () => {
        const pp = local.getResults().getPoi(0).point
        this.map.centerAndZoom(pp, 18)
        this.map.addOverlay(new window.BMap.Marker(pp))
      }
      const local = new window.BMap.LocalSearch(this.map, {
        onSearchComplete: myFun
      })
      local.search(myValue)
    }
  },
  beforeDestory () {
    this.map.destroy()
  }
}
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>
