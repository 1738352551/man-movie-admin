import { axios } from '@/utils/request'

export function getTags () {
  return axios({
    url: '/tag',
    method: 'get'
  })
}
