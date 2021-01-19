import request from '@/utils/request'

export function getTimeTable(params) {
  return request({
    url: 'admin/Timetable/getTimeTable',
    method: 'get',
    params
  })
}
export function addTimeTable(data) {
  return request({
    url: 'admin/Timetable/addTimeTable',
    method: 'post',
    data
  })
}
export function updateTimeTable(data) {
  return request({
    url: 'admin/Timetable/updateTimeTable',
    method: 'post',
    data
  })
}
export function deleteTimeTable(data) {
  return request({
    url: 'admin/Timetable/deleteTimeTable',
    method: 'post',
    data
  })
}
export function getUserClass(params) {
  return request({
    url: 'admin/Timetable/getUserClass',
    method: 'get',
    params
  })
}