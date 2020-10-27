import request from '@/utils/request'

export function getTimeTable(params) {
  return request({
    url: '/Timetable/getTimeTable',
    method: 'get',
    params
  })
}
export function addTimeTable(data) {
  return request({
    url: '/Timetable/addTimeTable',
    method: 'post',
    data
  })
}
export function updateTimeTable(data) {
  return request({
    url: '/Timetable/updateTimeTable',
    method: 'post',
    data
  })
}
export function deleteTimeTable(data) {
  return request({
    url: '/Timetable/deleteTimeTable',
    method: 'post',
    data
  })
}
