import request from '@/utils/request'

export function getUser(query) {
  return request({
    url: '/admin/user/getUser',
    method: 'get',
    params: query
  })
}
export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}
