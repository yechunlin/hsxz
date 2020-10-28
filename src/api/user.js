import request from '@/utils/request'

export function getUser(query) {
  return request({
    url: 'admin/user/getUser',
    method: 'get',
    params: query
  })
}
export function login(data) {
  return request({
    url: 'admin/user/login',
    method: 'post',
    data
  })
}
export function getInfo(query) {
  return request({
    url: 'admin/user/info',
    method: 'get',
    params: query
  })
}
export function logout(data) {
  return request({
    url: 'admin/user/logout',
    method: 'post',
	data
  })
}
export function updateUser(data) {
  return request({
    url: 'admin/user/updateUser',
    method: 'post',
    data
  })
}