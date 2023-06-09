import { axios } from '@/utils/request'

// 分页查询视频信息
export function movieInfoListPage (queryForm) {
  return axios(
    {
      url: '/movie_info/list/page',
      method: 'POST',
      data: queryForm
    }
  )
}

// 添加影视信息
export function addMovieInfo (data) {
  return axios(
    {
      url: '/movie_info/add',
      method: 'POST',
      data
    }
  )
}

// 修改影视信息
export function updateMovieInfo (data) {
  return axios(
    {
      url: '/movie_info/update',
      method: 'POST',
      data
    }
  )
}

// 获取影视信息
export function getMovieInfo (movieId) {
  return axios(
    {
      url: '/movie_info/getMovieInfo',
      method: 'GET',
      params: { id: movieId }
    }
  )
}

// 删除影视信息
export function deleteMovieInfo (ids) {
  return axios(
    {
      url: '/movie_info/delete',
      method: 'DELETE',
      data: ids
    }
  )
}
