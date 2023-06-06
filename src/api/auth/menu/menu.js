import { axios } from '@/utils/request'

export function getTreeList () {
  return axios({
    url: '/menu/treeList',
    method: 'get'
  })
}
