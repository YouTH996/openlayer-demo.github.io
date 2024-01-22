<template>
  <div id="app">
    <div id="map" class="map" ref="map"></div>
  </div>
</template>

<script>
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat} from "ol/proj";
import {getShip} from "@/api/ship";
import {createStyle, getLonLatList, getXyzLayer} from "@/utils/map";

export default {
  name: 'App',
  components: {},
  data() {
    return {
      layers: [], //图层
      shipLayer: undefined,
      map: undefined,//底图容器，
      dataList: []//船舶数据
    }
  },
  mounted() {
    this.initShipLayer()
    this.initLayer()
    this.initMap()
    this.moveHandler()
  },
  methods: {
    //加载船舶图层
    initShipLayer() {
      this.shipLayer = new VectorLayer({
        source: new VectorSource({})
      });
    },
    //加载所有图层
    initLayer() {
      let baseMap = getXyzLayer("http://t{0-4}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=b37845418765777e2fee031e0b569fbb")
      let markMap = getXyzLayer("http://t{0-4}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=b37845418765777e2fee031e0b569fbb")
      this.layers = [baseMap, markMap, this.shipLayer]
    },
    //初始化容器
    initMap() {
      this.map = new Map({
        layers: this.layers,
        // 设置显示地图的视图
        view: new View({
          center: fromLonLat([121.1265, 33.3186]), // 地图中心点 经纬度
          zoom: 11, // 缩放级别-显示层级
          minZoom: 1, // 最小缩放级别
          maxZoom: 18, // 最大缩放级别
          constrainResolution: true,
          smoothExtentConstraint: true,
        }),
        // olMap为map的地图容器
        target: this.$refs.map, // DOM容器
      });
    },
    //船舶数据处理类
    shipDataHandler(lonLat) {
      this.getShip(lonLat).then(() => {
        const features = this.dataList.map(item => {
          return {
            geometry: new Point(fromLonLat([item.longitude, item.latitude])),
            name: item.mmsi.toString(),
            mmsi: item.mmsi,
            sog: item.sog,
            cog: (item.cog) / 10
          }
        })
        features.forEach(featureOptions => {
          const feature = new Feature({
            geometry: featureOptions.geometry,
          });
          feature.setStyle(createStyle(featureOptions));
          this.shipLayer.getSource().addFeature(feature)
        })
      })

    },
    //获取船舶数据
    getShip({minPosStr, maxPosStr}) {
      return getShip({
        lb: minPosStr,
        rt: maxPosStr
      }).then(res => {
        this.shipLayer.getSource().clear()
        this.dataList = res.data
      })
    },
    // 船舶数据
    moveHandler() {
      this.map.on("moveend", () => {
        this.zoom = this.map.getView().getZoom().toFixed(0);
        if (this.zoom < 11) {
          return;
        }
        if (this.map) {
          let lonLat = getLonLatList(this.map);
          //请求船舶数据
          this.shipDataHandler(lonLat);
        }
      });
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}

.map {
  width: 100%;
  height: 100vh;
}
</style>
