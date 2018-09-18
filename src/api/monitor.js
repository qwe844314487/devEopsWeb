import request from '@/utils/request'

/*
* API_MODULE: WORK
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MonitorHostAliyunCPU(uuid, time){
    return request({
      url: '/api-monitor/v1/host/'+uuid+'/cpu/aliyun/byuuid/'+time+'/',
      method: 'GET'
    })
}

export function fetch_MonitorHostAliyunMemory(uuid, time){
  return request({
    url: '/api-monitor/v1/host/'+uuid+'/memory/aliyun/byuuid/'+time+'/',
    method: 'GET'
  })
}

export function fetch_MonitorHostAliyunDiskRead(uuid, time){
  return request({
    url: '/api-monitor/v1/host/'+uuid+'/disk/read/aliyun/byuuid/'+time+'/',
    method: 'GET'
  })
}

export function fetch_MonitorHostAliyunInternetIn(uuid, time){
  return request({
    url: '/api-monitor/v1/host/' + uuid + '/internet/in/aliyun/byuuid/'+time+'/',
    method: 'GET'
  })
}

export function fetch_MonitorHostAliyunDiskUse(uuid, time){
  return request({
    url: '/api-monitor/v1/host/'+ uuid + '/disk/use/',
  })
}