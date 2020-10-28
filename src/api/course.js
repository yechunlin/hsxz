import request from '@/utils/request'

export function getCourse(query) {
  return request({
    url: 'admin/Course/getCourse',
    method: 'get',
    params: query
  })
}

export function getCourseInfo(id) {
  return request({
    url: 'admin/Course/getCourseInfo',
    method: 'get',
    params: { id }
  })
}

export function addCourse(data) {
  return request({
    url: 'admin/Course/addCourse',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: 'admin/Course/deleteCourse',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: 'admin/Course/updateCourse',
    method: 'post',
    data
  })
}
