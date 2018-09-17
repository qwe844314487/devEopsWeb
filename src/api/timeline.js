import request from '@/utils/request'

/*
* API_MODULE: TIMELINE
* API_USE: FETCH,CREATE,UPDATE,DELETE
* */
export function fetch_MonitorHostAliyunCPU(uuid, time){
    return request({
      url: '/api-monitor/v1/host/'+uuid+'/cpu/aliyun/byuuid/'+time+'/',
      method: 'GET'
    })
}