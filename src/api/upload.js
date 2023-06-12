import { axios } from '@/utils/request'

export function uploadFile (file) {
  const forms = new FormData().append('file', file)

  return axios({
    url: '/file/upload',
    method: 'POST',
    data: forms
  })
}
