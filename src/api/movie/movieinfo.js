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
