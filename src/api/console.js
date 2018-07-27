import request from '@/utils/request'

/*
* API_MODULE: TRUCK
* API_USE: CREATE
* */
export function create_Truck(obj){
  return request({
    url: '/api-console/v1/truck/create/',
    method: 'POST',
    data: obj
  })
}