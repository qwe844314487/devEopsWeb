import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: EZSETUP
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_EZSetupList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-ezsetup/v1/bypage/' + st,
    method: 'GET'
  })
}