import Vue from 'vue'
import Vuex from 'vuex'
import { err, instance } from '../libs/fetchData'
import { router } from '../router/index'
import app from './modules/app'
import global from './modules/global'
import user from './modules/user'
import { getToken, setToken, removeToken } from '../libs/auth'
import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {

  },
  modules: {
    app,
    global,
    user
  },
  getters
})

instance.interceptors.response.use(
  response => {
    const code = parseInt(response.data.code, 10)
    switch (code) {
      case 10107:
        store.dispatch('logout').then(() => {
          store.commit('clearOpenedSubmenu')
          router.push({
            path: '/login'
          })
        })
        break
      case 10108:
        router.push({
          path: '/403'
        })
        break
      default:
        return response
    }
  },
  error => {
    return Promise.reject(
      err(error.response.status, '服务器错误，请联系管理员。(server failed)', error.response)
    )
  }
)
instance.interceptors.request.use(config => {
  console.log("我是拦截器", store.getters.access_token)
  if (store.getters.access_token) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})
export default store
