import request from '@/utils/request'

//获取船舶数据
export function getShip(query) {
  return request({
      url: "https://ais.msa.gov.cn/api/app/aisInfo/artAndStaticData",
      method: 'get',
      params: query,
    }
  )
}

//获取船舶详情数据
export function getShipDetail(mmsi) {
  return request({
      url: "http://hljk.axfiber.com/prod-api/monitoring/ais/static/getInfoByMmsi/"+mmsi,
      method: 'get',
    }
  )
}
