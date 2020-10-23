import request from '@/utils/request'

export function getVideo(params) {
  return request({
    url: '/Video/getVideo',
    method: 'get',
    params
  })
}
