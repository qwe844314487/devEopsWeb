import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: FILE
* API_USE: FETCH,CREATE,DELETE
* */
export function fetch_FileList(){
  return request({
    url: '/api-utils/v1/file/',
    method: 'GET'
  })
}

export function fetch_FileListByPage(pagination, obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-utils/v1/file/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_File(data){
  return request({
    url: '/api-utils/v1/file/create/',
    method: 'POST',
    data: data
  })
}

export function delete_File(data){
  return request({
    url: '/api-utils/v1/file/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}


/*
* API_MODULE: IMAGE
* API_USE: FETCH,CREATE,DELETE
* */
export function fetch_ImageList(){
  return request({
    url: '/api-utils/v1/image/',
    method: 'GET'
  })
}

export function fetch_ImageListByPage(pagination){
  return request({
    url: '/api-utils/v1/image/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function create_Image(data){
  return request({
    url: '/api-utils/v1/image/create/',
    method: 'POST',
    data: data
  })
}

export function delete_Image(data){
  return request({
    url: '/api-utils/v1/image/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}
