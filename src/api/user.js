import request from '@/utils/request'

export function getUser(query) {
  return request({
    url: 'admin/user/getUser',
    method: 'get',
    params: query
  })
}
export function addUser(data) {
  return request({
    url: 'admin/user/addUser',
    method: 'post',
    data
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
export function deleteUser(data) {
  return request({
    url: 'admin/user/deleteUser',
    method: 'post',
    data
  })
}
export function getRouter(query) {
  return request({
    url: 'admin/user/getRouter',
    method: 'get',
    params: query
  })
}