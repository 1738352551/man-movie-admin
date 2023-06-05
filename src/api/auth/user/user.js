import { axios } from '@/utils/request'

/**
 * 用户登录
 * data : { username, password }
 * */
export function login (data) {
  return axios({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 当前登录用户
 * */
export function getUserInfo () {
  return axios({
    url: '/user/info',
    method: 'get'
  })
}

export function logout () {
  return axios({
    url: '/user/logout',
    method: 'get'
  })
}

export function getCurrentUserNav () {
  return axios({
      url: '/menu/ant',
      method: 'get'
    }
  )
}
