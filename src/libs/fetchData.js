import axios from 'axios'

/**
 * 封装好的get和post接口，调用方法情况action文件
 * @type {AxiosInstance}
 */
export let instance = axios.create({
  // baseURL: '', // 设置默认api路径
  timeout: 10000, // 设置超时时间
  // headers: { 'Authorization': 'Basic YWRtaW46OTdkYjc5MjBhMjg5NDM0MWI4NjQyZDYyOGIzYjE5MmQ=' }
})

export const getData = (url, param) => {
  return (
    instance.get(`${url}`, {
      params: param
    })
  )
}

export const postData = (url, param) => {
  return (
    instance.post(`${url}`, param)
  )
}

export const putData = (url, param) => {
  return (
    instance.put(`${url}`, param)
  )
}

export const delData = (url, param) => {
  return (
    instance.delete(`${url}`, param)
  )
}

export const err = (code, msg, rsp) => {
  return { code: code, msg: msg, rsp: rsp }
}

export const pageSize = 30