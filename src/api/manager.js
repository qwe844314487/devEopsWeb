import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: GROUP
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_GroupList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-manager/v1/group/' + st,
    method: 'GET'
  })
}

export function fetch_GroupOpsList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-manager/v1/group/byops/' + st,
    method: 'GET'
  })
}

export function fetch_GroupListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-manager/v1/group/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_Group(obj){
  return request({
    url: '/api-manager/v1/group/create/',
    method: 'POST',
    data: obj
  })
}

export function update_Group(obj){
  return request({
    url: '/api-manager/v1/group/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_Group(obj){
  return request({
    url: '/api-manager/v1/group/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}

export function framework_Group(id,data){
  return request({
    url: '/api-manager/v1/group/'+ id + '/framework/',
    method: 'PUT',
    data: data
  })
}

export function selectHost_Group(obj,data){
  return request({
    url: '/api-manager/v1/group/'+ obj.groups + '/selecthost/',
    method: 'PUT',
    data: data
  })
}

/*
* API_MODULE: HOST
* API_USE: FETCH,CREATE,UPDATE,DELETE,PASSWD,DETAIL
* */
export function fetch_HostList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-manager/v1/host/'+st,
    method: 'GET'
  })
}

export function fetch_HostListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-manager/v1/host/bypage/'+st+'&page='+pagination.page + '&page_size='+pagination.page_size,
    method: 'GET'
  })
}

export function fetch_HostPasswd(obj){
  return request({
    url: '/api-manager/v1/host/'+obj.uuid+'/'+obj.qrcode+'/passwd/',
    method: 'GET',
  })
}

export function create_Host(obj){
  return request({
    url: '/api-manager/v1/host/create/',
    method: 'POST',
    data: obj
  })
}

export function update_Host(obj){
  return request({
    url: '/api-manager/v1/host/'+obj.uuid+'/update/',
    method: 'PUT',
    data: obj
  })
}

export function delete_Host(obj){
  return request({
    url: '/api-manager/v1/host/'+obj.uuid+'/delete/',
    method: 'DELETE',
    data: obj
  })
}
 
export function selectGroup_Host(data){
  return request({
    url: '/api-manager/v1/host/'+ data.uuid + '/selectgroup/',
    method: 'PUT',
    data: data
  })
}