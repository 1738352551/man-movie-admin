import { axios } from '@/utils/request'

export function episodesListForMovie (movieId) {
  return axios({
    url: `/movie/episodes/movie/${movieId}`,
    method: 'get'
  })
}
