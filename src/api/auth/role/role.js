import { axios } from '@/utils/request'

// 获取角色列表
export function getRoleList () {
  return axios(
    {
      url: '/role/list',
      method: 'get'
    }
  )
}

export function rolePage (query) {
  return axios(
    {
      url: '/role/list/page',
      method: 'post',
      data: query
    }
  )
}

export function getRole (id) {
  return axios(
    {
      url: '/role/' + id,
      method: 'get'
    }
  )
}

export function addRole (data) {
  return axios(
    {
      url: '/role/add',
      method: 'post',
      data: data
    }
  )
}

export function updateRole (data) {
  return axios(
    {
      url: '/role/update',
      method: 'post',
      data: data
    }
  )
}

export function deleteRole (ids) {
  return axios(
    {
      url: '/role/delete',
      method: 'post',
      data: ids
    }
  )
}

export function getRoleActionableMenus (id) {
  return axios(
    {
      url: '/role/menu/' + id,
      method: 'get'
    }
  )
}
