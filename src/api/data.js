import request from '@/utils/request'

export const getMenu = () => {
  return request.request({
    url: 'menu',
    method: 'get'
  })
}

export const getHome = () => {
  return request.request({
    url: '/home/getData',
    method: 'get'
  })
}
