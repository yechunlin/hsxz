import request from '@/utils/request'

export function getClass(query) {
  return request({
    url: 'admin/Class/getClass',
    method: 'get',
    params: query
  })
}

export function getClassInfo(id) {
  return request({
    url: 'admin/Class/getClassInfo',
    method: 'get',
    params: { id }
  })
}

export function addClass(data) {
  return request({
    url: 'admin/Class/addClass',
    method: 'post',
    data
  })
}

export function deleteClass(data) {
  return request({
    url: 'admin/Class/deleteClass',
    method: 'post',
    data
  })
}

export function updateClass(data) {
  return request({
    url: 'admin/Class/updateClass',
    method: 'post',
    data
  })
}
