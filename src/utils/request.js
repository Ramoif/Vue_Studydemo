import axios from 'axios'
import router from '../router'
import _global from '@/config/index'

// 这里的baseURL会让所有api请求加上baseURL
// 注意这里的配置，无需则删除
const request = axios.create({
  baseURL: `http://${_global._filesUrl}`,
  timeout: 30000
})

// 请求白名单，不会被拦截
const whiteUrls = ['/user/login', '/user/register']

// request 拦截器 :
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  // 取出sessionStorage里面缓存的用户信息
  const userJson = sessionStorage.getItem('user')
  // 白名单校验
  if (!whiteUrls.includes(config.url)) {
    // 若未登录或过期，跳转到登录页面
    if (!userJson) {
      router.push('/login')
    } else {
      // 设置请求头-token
      const user = JSON.parse(userJson)
      config.headers.token = user.token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response 拦截器 :
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  response => {
    let res = response.data
    // 如果是返回的文件
    if (response.config.responseType === 'blob') {
      return res
    }
    // 兼容服务端返回的string，转换JSON
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    // 验证token
    if (res.code === '401') {
      console.error('token过期，重新登录')
      router.push('/login')
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default request
