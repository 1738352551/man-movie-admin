import { axios } from '@/utils/request'

export function getTreeList () {
  return axios({
    url: '/menu/treeList',
    method: 'get'
  })
}

// 分页查询菜单
export function menuPage (query) {
  return axios({
    url: '/menu/list',
    method: 'Post',
    data: query
  })
}

export function addMenu (data) {
  return axios({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function updateMenu (data) {
  return axios({
    url: '/menu/update',
    method: 'post',
    data
  })
}

export function deleteMenu (data) {
  return axios({
    url: '/menu/delete',
    method: 'post',
    data
  })
}

export function getMenu (id) {
  return axios({
    url: `/menu/${id}`
  })
}
