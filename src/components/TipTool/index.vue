<template>
  <!--经纬度、船舶数量、比例尺工具-->
  <div id="tips-tool">
    <!-- 经纬度显示 -->
    <div class="mouse-wrapper">
      <div id="mouse-block"></div>
    </div>
    <!-- 比例尺 -->
    <div class="scale-wrapper">
      <div id="scale-block"></div>
    </div>
    <div class="zoom-wrapper">
      <div id="zoom-block">当前层级:{{ zoom }} | 船舶数量:{{ shipCount }}</div>
    </div>
  </div>
</template>

<script>


import {addMousePosition, addScale} from '@/utils/tipsTool'

export default {
  name: 'tips-tool',
  props: {
    shipCount: '',
    map: '',
    zoom: ''
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      addMousePosition(this.map, 'mouse-block') //获取鼠标经纬度
      addScale(this.map, 'scale-block') //添加比例尺
    }
  }
}
</script>

<style scoped>
.mouse-wrapper {
  position: absolute;
  right: 20px;
  bottom: 5px;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 2px;
  z-index: 1;
  box-sizing: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#mouse-block {
  border: 1px solid #646464;
  border-top: none;
  color: #2c2b2b;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  margin: 1px;
  will-change: contents, width;
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
}

.scale-wrapper {
  position: absolute;
  right: 20px;
  bottom: 80px;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 2px;
  z-index: 1;
  box-sizing: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.scale-wrapper #scale-block {
  border: 1px solid #646464;
  border-top: none;
  color: #2c2b2b;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 1px;
  will-change: contents, width;
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
}

.zoom-wrapper {
  position: absolute;
  bottom: 40px;
  right: 20px;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 2px;
  z-index: 1;
  box-sizing: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#zoom-block {
  border: 1px solid #646464;
  border-top: none;
  color: #2c2b2b;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  margin: 1px;
  will-change: contents, width;
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
}

</style>
