import request from '@/utils/request'

export function getVideo(params) {
  return request({
    url: '/Video/getVideo',
    method: 'get',
    params
  })
}
export function addVideo(data) {
  return request({
    url: '/Video/addVideo',
    method: 'post',
    data
  })
}
export function updateVideo(data) {
  return request({
    url: '/Video/updateVideo',
    method: 'post',
    data
  })
}
export function deleteVideo(data) {
  return request({
    url: '/Video/deleteVideo',
    method: 'post',
    data
  })
}
