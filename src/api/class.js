import request from '@/utils/request'

export function getClass(query) {
  return request({
    url: '/Class/getClass',
    method: 'get',
    params: query
  })
}

export function getClassInfo(id) {
  return request({
    url: 'Class/getClassInfo',
    method: 'get',
    params: { id }
  })
}

export function addClass(data) {
  return request({
    url: 'Class/addClass',
    method: 'post',
    data
  })
}

export function deleteClass(data) {
  return request({
    url: '/Class/deleteClass',
    method: 'post',
    data
  })
}

export function updateClass(data) {
  return request({
    url: '/Class/updateClass',
    method: 'post',
    data
  })
}
