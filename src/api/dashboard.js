import request from '@/utils/request'

/*
* API_MODULE: EXPIRED
* API_USE: FETCH
* API_ARGV: ECS RDS MANAGER
* */
export function fetch_ExpiredAliyunECSList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/ecs/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_ExpiredAliyunRDSList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/rds/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_ExpiredAliyunKVStoreList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/kvstore/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_ExpiredAliyunMongoDBList(pagination){
  return request({
    url: '/api-dashboard/v1/expired/mongodb/bypage/'+'?page='+pagination.page,
    method: 'GET'
  })
}

export function fetch_Count(){
  return request({
    url: '/api-dashboard/v1/count/',
    method: 'GET'
  })
}

export function fetch_Work(){
  return request({
    url: '/api-dashboard/v1/work/',
    method: 'GET'
  })
}

export function fetch_Group(){
  return request({
    url: '/api-dashboard/v1/group/',
    method: 'GET'
  })
}

