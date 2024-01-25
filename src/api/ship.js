import request from '@/utils/request'

//获取船舶数据
export function getShip(query) {
  return request({
      url: "/api/app/aisInfo/artAndStaticData",
      method: 'get',
      params: query,
    }
  )
}

//获取船舶详情数据
export function getShipDetail(query) {
  return request({
      url: "/api/app/aisInfo/rtAndStaticData",
      method: 'get',
      params: query,
    }
  )
}
