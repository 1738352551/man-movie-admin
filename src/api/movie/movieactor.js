import { axios } from '@/utils/request'

export function listActorByPage (queryForm) {
  return axios({
    url: '/actors/list/page',
    method: 'post',
    data: queryForm
  })
}

export function getActor (id) {
  return axios({
    url: '/actors/getActor',
    method: 'get',
    params: { id }
  })
}

export function delActor (ids) {
  return axios({
    url: '/actors/delete',
    method: 'delete',
    data: ids
  })
}

export function addActor (data) {
  return axios({
    url: '/actors/add',
    method: 'post',
    data
  })
}

export function updateActor (data) {
  return axios({
    url: '/actors/update',
    method: 'post',
    data
  })
}

export function allActor () {
  return axios({
    url: '/actors/all',
    method: 'get'
  })
}
