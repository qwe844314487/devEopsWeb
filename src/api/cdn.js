import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: CDN
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */

export function fetch_CDNListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-cdn/v1/cdn/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_CDN(obj){
  return request({
    url: '/api-cdn/v1/cdn/create/',
    method: 'POST',
    data: obj
  })
}