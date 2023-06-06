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
