<template>
  <div id="app">
    <div id="map" class="map" ref="map"></div>
    <search-box/>
    <detail-box v-if="detailBoxVisible" ref="detailBox" @detailBoxClose="detailBoxVisible=false"/>
    <tips-tool v-if="map" :map="map" :ship-count="0" :zoom="zoom"/>
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
import {createNoLabelStyle, createStyle, getLonLatList, getXyzLayer, selectStyle} from "@/utils/map";
import searchBox from "@/components/SearchBox/index.vue";
import detailBox from "@/components/DetaiBox/index.vue";
import TipsTool from "@/components/TipTool/index.vue";

export default {
  name: 'App',
  components: {TipsTool, searchBox, detailBox},
  data() {
    return {
      layers: [], //图层
      shipLayer: undefined,
      map: undefined,//底图容器，
      zoom: 11,//底图层级，
      dataList: [],//船舶数据
      detailBoxVisible: false  //船舶详情框是否可见
    }
  },
  mounted() {
    this.initShipLayer()
    this.initLayer()
    this.initMap()
    this.moveHandler()
    this.clickHandler()
  },
  methods: {
    //加载船舶图层
    initShipLayer() {
      this.shipLayer = new VectorLayer({
        source: new VectorSource({}),
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
        controls: [],
        layers: this.layers,
        // 设置显示地图的视图
        view: new View({
          center: fromLonLat([121.1265, 33.3186]), // 地图中心点 经纬度
          zoom: this.zoom, // 缩放级别-显示层级
          minZoom: 1, // 最小缩放级别
          maxZoom: 18, // 最大缩放级别
          constrainResolution: true,
          smoothExtentConstraint: true,
        }),
        // olMap为map的地图容器
        target: this.$refs.map, // DOM容器
      });
    },
    //获取两艘船之间的距离
    getDistance() {
      let labelDistance = 100;
      if (this.zoom >= 16) {
        labelDistance = 150
      } else if (this.zoom === 15) {
        labelDistance = 10000
      } else if (this.zoom <= 14) {
        labelDistance = 20000
      }
      return labelDistance
    },
    //船舶数据处理类
    shipDataHandler(lonLat) {
      this.getShip(lonLat).then(() => {
        console.log(new Date().getTime());
        for (let i = 0; i < this.dataList.length; i++) {
          let item = this.dataList[i]
          let feature = this.setShipFeature(item)
          this.shipLayer.getSource().addFeature(feature)
          for (let j = i + 1; j < this.dataList.length; j++) {
            const distance = fromLonLat([ item.longitude,  item.latitude])
              .map((val, idx) => val - fromLonLat([ this.dataList[j].longitude,   this.dataList[j].latitude])[idx])
              .reduce((acc, val) => acc + val * val, 0);
            if (distance < this.getDistance()) {
              feature.setStyle(createNoLabelStyle(feature.values_));
            }
          }
        }
        console.log(new Date().getTime());
      });

    },
    setShipFeature(item) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([item.longitude, item.latitude])),
        name: item.shipname || item.mmsi.toString(),
        mmsi: item.mmsi,
        sog: item.sog,
        cog: (item.cog) / 10
      });
      feature.setStyle(createStyle(feature.values_));
      return feature
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
      //鼠标样式修改
      this.map.on("pointermove", (e) => {
        if (this.map.hasFeatureAtPixel(e.pixel)) {
          this.map.getViewport().style.cursor = "pointer";
        } else {
          this.map.getViewport().style.cursor = "inherit";
        }
      });
    },
    // 点击获取信息
    clickHandler() {
      this.map.on("singleclick", (e) => {
        // 判断是否点击在点上
        const feature = this.map.forEachFeatureAtPixel(e.pixel, (item) => item);
        if (feature) {
          feature.values_.hasSelected = true
          let styleArray = feature.getStyle()
          styleArray.push(selectStyle())
          feature.setStyle(styleArray)
          this.detailBoxVisible = true
          this.$nextTick(() => {
            this.$refs['detailBox'].init(feature.values_)
          })

        }
      });
    },
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
  z-index: -9999;
}
</style>
