import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'
import { get } from 'https';

/*
* API_MODULE: WORK
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_WorkListByPage(pagination,obj){
  let st = objectIterator(obj)
    return request({
      url: '/api-work/v1/codework/bypage/'+ st +'&page='+pagination.page,
      method: 'GET'
    })
  }

  export function create_Work(data){
    return request({
      url: '/api-work/v1/codework/create/',
      method: 'POST',
      data: data
    })
  }

  export function check_Work(obj){
    return request({
      url: '/api-work/v1/codework/'+obj.uuid+'/check/',
      method: 'PUT',
      data: {'status':2, 'qrcode':obj.qrcode}
    })
  }

  export function run_Work(obj){
    return request({
      url: '/api-work/v1/codework/'+obj.uuid+'/run/',
      method: 'PUT',
      data: {'status':4, 'qrcode':obj.qrcode}
    })
  }

  export function upload_Work(obj){
    return request({
      url: '/api-work/v1/codework/'+obj.uuid+'/upload/',
      method: 'PUT',
      data: {"files":obj.uuid_list, 'qrcode':obj.qrcode}
    })
  }

  export function results_Work(obj){
    return request({
      url: '/api-work/v1/codework/'+obj.uuid+'/results/',
      method: 'GET'
    })
  }