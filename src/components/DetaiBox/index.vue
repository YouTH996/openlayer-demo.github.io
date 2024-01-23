<template>
  <div id="detail-box">
    <el-card>
      <el-descriptions class="margin-top" title="AIS信息" :column="2" size="medium" border>
        <template slot="extra">
          <el-button type="danger" size="small" icon="el-icon-close" circle @click="close"></el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            MMSI:
          </template>
          {{ form.mmsi }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            船首向:
          </template>
          {{ form.trueHeading }}度
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            呼号:
          </template>
          {{ form.callSign }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            航向:
          </template>
          {{ form.cog }}度
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            IMO:
          </template>
          {{ form.imoNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            航速:
          </template>
          {{ form.sog }}节
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            类型:
          </template>
          {{ form.shipTypeText }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            纬度:
          </template>
          {{ form.latitude }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            状态:
          </template>
          {{ form.navigationText }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            经度:
          </template>
          {{ form.longitude }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            船长:
          </template>
          {{ form.shipLength }}米
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            目的地:
          </template>
          {{ form.destination }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            船宽:
          </template>
          {{ form.shipWidth }}米
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            预到时间:
          </template>
          {{ form.sog }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            吃水:
          </template>
          {{ form.eatTime }}米
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            更新时间:
          </template>
          {{ form.updateDateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

  </div>
</template>
<script>
import {getShipDetail} from "@/api/ship";

export default {
  name:"search_box",
  data(){
    return{
      form:''
    }
  },
  methods:{
    init({mmsi}){
      getShipDetail(mmsi).then(res=>{
        this.form=res.data
      })
    },
    close(){
      this.$emit("detailBoxClose")
    }
  }

}
</script>



<style>
#detail-box{
  position: absolute;
  top: 60px;
  left: 20px;
  height: 600px;
  width: 500px;
}
</style>
