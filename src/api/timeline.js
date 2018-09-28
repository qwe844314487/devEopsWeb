import request from '@/utils/request'

/*
* API_MODULE: TIMELINE
* API_USE: FETCH
* */
export function fetch_TimelineByPage(pagination){
  return request({
    url: '/api-timeline/v1/bypage/?page='+pagination.page,
    method: 'GET'
  })
}