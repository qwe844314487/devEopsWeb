import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: CDN
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */

export function fetch_IPoolListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ipool/v1/list/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}