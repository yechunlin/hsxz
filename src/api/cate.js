import request from '@/utils/request'

export function getCate(query) {
  return request({
    url: 'admin/Cate/getCate',
    method: 'get',
    params: query
  })
}

export function getCateInfo(id) {
  return request({
    url: 'admin/Cate/getCateInfo',
    method: 'get',
    params: { id }
  })
}

export function addCate(data) {
  return request({
    url: 'admin/Cate/addCate',
    method: 'post',
    data
  })
}

export function deleteCate(data) {
  return request({
    url: 'admin/Cate/deleteCate',
    method: 'post',
    data
  })
}

export function updateCate(data) {
  return request({
    url: 'admin/Cate/updateCate',
    method: 'post',
    data
  })
}
