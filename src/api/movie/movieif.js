import { axios } from '@/utils/request'

export function listMovieIf (query) {
  return axios({
    url: '/video_api/list/page',
    method: 'post',
    params: query
  })
}

export function addMovieIf (data) {
  return axios({
    url: '/video_api/add',
    method: 'post',
    data
  })
}

export function updateMovieIf (data) {
  return axios({
    url: '/video_api/update',
    method: 'post',
    data
  })
}

export function delMovieIf (ids) {
  return axios({
    url: '/video_api/delete',
    method: 'delete',
    data: ids
  })
}

export function getMovieIf (id) {
  return axios({
    url: '/video_api/getVideoApi',
    method: 'get',
    params: { id }
  })
}
