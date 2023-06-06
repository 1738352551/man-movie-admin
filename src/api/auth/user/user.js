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

// 分页查询
export function listPage (data) {
  return axios({
    url: '/user/list/page',
    method: 'post',
    data
  })
}

export function addUser (data) {
  return axios({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser (data) {
  return axios({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 根据用户id获取用户
export function getUserById (id) {
  return axios({
    url: '/user/' + id,
    method: 'get'
  })
}

// 删除用户
export function deleteUser (ids) {
  return axios({
    url: '/user/delete',
    method: 'post',
    data: ids
  })
}
