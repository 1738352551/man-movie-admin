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
