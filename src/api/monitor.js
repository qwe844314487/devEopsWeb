import request from '@/utils/request'

/*
* API_MODULE: WORK
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MonitorHostAliyunCPU(uuid){
    return request({
      url: '/api-monitor/v1/host/'+uuid+'/cpu/aliyun/byuuid/',
      method: 'GET'
    })
}

export function fetch_MonitorHostAliyunMemory(uuid){
  return request({
    url: '/api-monitor/v1/host/'+uuid+'/memory/aliyun/byuuid/',
    method: 'GET'
  })
}

export function fetch_MonitorHostAliyunDiskRead(uuid){
  return request({
    url: '/api-monitor/v1/host/'+uuid+'/disk/read/aliyun/byuuid/',
    method: 'GET'
  })
}

export function fetch_MonitorHostAliyunInternetIn(uuid){
  return request({
    url: '/api-monitor/v1/host/'+uuid+'/internet/in/aliyun/byuuid/',
    method: 'GET'
  })
}