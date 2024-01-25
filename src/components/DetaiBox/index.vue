<template>
  <div id="detail-box">
    <el-card>
      <el-descriptions class="margin-top" :title="form.shipname" :column="2" size="medium" border>
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
          {{ form.callno }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            航向:
          </template>
          {{ form.cog ? `${form.cog / 10.0}度` : "" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            IMO:
          </template>
          {{ form.imo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            航速:
          </template>
          {{ form.sog ? `${form.sog / 10.0}节` : "" }}
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
          {{ form.length ? `${form.length}米` : "" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            目的地:
          </template>
          {{ form.dest }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            船宽:
          </template>
          {{ form.width ? `${form.width}米` : "" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            预到时间:
          </template>
          {{ formatEtaTime(form.eta) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            吃水:
          </template>
          {{ form.draft ? `${form.draft}米` : "" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            更新时间:
          </template>
          {{ parseTime(form.receivetime) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

  </div>
</template>
<script>
import {getShipDetail} from "@/api/ship";
import {parseTime} from "@/utils/date";

export default {
  name: "search_box",
  data() {
    return {
      form: ''
    }
  },
  methods: {
    parseTime,
    init({mmsi}) {
      getShipDetail({mmsi}).then(res => {
        this.form = res.data
      })
    },
    close() {
      this.$emit("detailBoxClose")
    },
    formatEtaTime(eta) {
      if (eta) {
        let r = eta
        return parseTime(new Date((new Date()).getFullYear() + "-" + r.substring(0, 2) + "-" + r.substring(2, 4) + " " + r.substring(4, 6) + ":" + r.substring(6) + ":00"));
      }

    }
  }

}
</script>


<style>
#detail-box {
  position: absolute;
  top: 60px;
  left: 20px;
  height: 600px;
  width: 500px;
}
</style>
