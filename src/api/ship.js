import request from '@/utils/request'

export function getShip(query) {
  return request({
      url: "https://ais.msa.gov.cn/api/app/aisInfo/artAndStaticData",
      method: 'get',
      params: query,
    }
  )


}
