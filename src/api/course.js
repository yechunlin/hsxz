import request from '@/utils/request'

export function getCourse(query) {
  return request({
    url: '/Course/getCourse',
    method: 'get',
    params: query
  })
}

export function getCourseInfo(id) {
  return request({
    url: 'Course/getCourseInfo',
    method: 'get',
    params: { id }
  })
}

export function addCourse(data) {
  return request({
    url: 'Course/addCourse',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/Course/deleteCourse',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/Course/updateCourse',
    method: 'post',
    data
  })
}
