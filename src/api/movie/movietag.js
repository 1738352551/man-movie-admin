import { axios } from '@/utils/request'

export function getTags () {
  return axios({
    url: '/tag',
    method: 'get'
  })
}

export function listTags (queryForm) {
  return axios({
    url: '/tag/list/page',
    method: 'post',
    data: queryForm
  })
}

export function getTag (id) {
  return axios({
    url: '/getTag',
    method: 'get',
    params: { id: id }
  })
}

export function addTag (data) {
  return axios({
    url: '/tag/add',
    method: 'post',
    data: data
  })
}

export function updateTag (data) {
  return axios({
    url: '/tag/update',
    method: 'post',
    data: data
  })
}

export function deleteTag (ids) {
  return axios({
    url: '/tag/delete',
    method: 'delete',
    data: ids
  })
}
