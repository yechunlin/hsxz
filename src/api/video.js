import request from '@/utils/request'

export function getVideo(params) {
  return request({
    url: 'admin/Video/getVideo',
    method: 'get',
    params
  })
}
export function addVideo(data) {
  return request({
    url: 'admin/Video/addVideo',
    method: 'post',
    data
  })
}
export function updateVideo(data) {
  return request({
    url: 'admin/Video/updateVideo',
    method: 'post',
    data
  })
}
export function deleteVideo(data) {
  return request({
    url: 'admin/Video/deleteVideo',
    method: 'post',
    data
  })
}
