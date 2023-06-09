import { axios } from '@/utils/request'

export function episodesListForMovie (movieId) {
  return axios({
    url: `/movie/episodes/movie/${movieId}`,
    method: 'get'
  })
}

export function getMovieEpisodes (id) {
  return axios({
    url: `/movie/episodes/getMovieEpisodes`,
    method: 'get',
    params: {
      id: id[0]
    }
  })
}

export function deleteEpisodes (ids) {
  return axios({
    url: `/movie/episodes/delete`,
    method: 'post',
    data: { ids }
  })
}

export function updateEpisodes (data) {
  return axios({
      url: `/movie/episodes/update`,
      method: 'post',
      data
  })
}

export function addEpisodes (data) {
  return axios({
      url: `/movie/episodes/add`,
      method: 'post',
      data
  })
}
