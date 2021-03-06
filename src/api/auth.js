import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

/*
* API_MODULE: USER
* API_USE: FETCH
* */
export function fetch_UserList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/user/' + st,
    method: 'GET'
  })
}

export function fetch_UserListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/user/bypage/'+st+'&page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_OpsUserList(){
  return request({
    url: '/api-auth/v1/opsuser/',
    method: 'GET'
  })
}

export function fetch_OpsUserListByPage(pagination){
  return request({
    url: '/api-auth/v1/opsuser/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function create_User(data){
  return request({
    url: '/api-auth/v1/user/create/',
    method: 'POST',
    data: data
  })
}

export function update_User(data){
  return request({
    url: '/api-auth/v1/user/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

export function qrcode_User(){
  return request({
    url: '/api-auth/v1/user/qrcode/',
    method: 'GET'
  })
}

export function is_expire_User(){
  return request({
    url: '/api-auth/v1/user/expire/',
    method: 'GET'
  })
}

/*
* API_MODULE: PmnList
* API_USE: FETCH,CREATE
* */
export function fetch_PmnGroupList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/group/' + st,
    method: 'GET'
  })
}

export function fetch_PmnGroupListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/group/bypage/'+ st +'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_PmnGroup(data){
  return request({
    url: '/api-auth/v1/group/create/',
    method: 'POST',
    data: data
  })
}

export function update_PmnGroup(data){
  return request({
    url: '/api-auth/v1/group/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

export function fetch_Permission(){
  return request({
    url: '/api-auth/v1/permission/',
    method: 'GET'
  })
}

/*
* API_MODULE: KEY
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_KeyList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/key/' + st,
    method: 'GET'
  })
}

export function fetch_KeyListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/key/bypage/'+ st +'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_Key(data){
  return request({
    url: '/api-auth/v1/key/create/',
    method: 'POST',
    data: data
  })
}

export function update_Key(data){
  return request({
    url: '/api-auth/v1/key/'+data.uuid+'/update/',
    method: 'PUT',
    data: data
  })
}

export function delete_Key(data){
  return request({
    url: '/api-auth/v1/key/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}

/*
* API_MODULE: JUMPER
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_JumperList(obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/jumper/' + st,
    method: 'GET'
  })
}

export function fetch_JumperListByPage(pagination,obj){
  let st = objectIterator(obj)
  return request({
    url: '/api-auth/v1/jumper/bypage/'+ st +'&page='+pagination.page,
    method: 'GET'
  })
}

export function create_Jumper(data){
  return request({
    url: '/api-auth/v1/jumper/create/',
    method: 'POST',
    data: data
  })
}

export function update_Jumper(data){
  return request({
    url: '/api-auth/v1/jumper/'+data.uuid+'/update/',
    method: 'PUT',
    data: data
  })
}

export function delete_Jumper(data){
  return request({
    url: '/api-auth/v1/jumper/'+data.uuid+'/delete/',
    method: 'DELETE',
    data: data
  })
}

export function status_Jumper(data){
  return request({
    url: '/api-auth/v1/jumper/'+data.uuid+'/status/',
    method: 'GET'
  })
}