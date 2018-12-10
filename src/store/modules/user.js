import Cookies from 'js-cookie'
import * as mt from '../mutation-types'
import {getData, postData, putData,err} from '../../libs/fetchData'
import {merge} from 'lodash'
import {getToken, setToken, removeToken} from '../../libs/auth'
import {
  setStore,
  getStore
} from '../../libs/store'

const state = {
  user: '',
  avatar: '',
  tagWel: '',
  userInfo: getStore({
    name: 'userInfo'
  }) || {},
  permissions: getStore({
    name: 'permissions'
  }) || {},
  roles: getStore({
    name: 'roles'
  }) || [],
  menu: getStore({
    name: 'menu'
  }) || [],
  isInitMenu: getStore({
    name: 'isInitMenu'
  }) || false,
  access_token: getStore({
    name: 'access_token'
  }) || '',
  refresh_token: getStore({
    name: 'refresh_token'
  }) || ''
}

const getters = {}

const actions = {
  // async login({ commit }, obj) {
  //   try {
  //     let res = await postData(`/system/login`, obj).catch(err => {
  //       commit('GLOBAL_ERR', err, { root: true })
  //     })
  //
  //     switch (res.data.code) {
  //       case 0:
  //         commit(mt.SET_USER, res.data.user)
  //         break
  //       default:
  //         break
  //     }
  //
  //     return res.data
  //   } catch (error) {
  //     console.log('error: ', error)
  //   }
  // },
  async login({commit}, obj) {
    try {
      let res = await postData(`admin/user/login`, obj).catch(err => {
        commit('GLOBAL_ERR', err, {root: true})
      })
      console.log(res)
      let resUserInfo
      switch (res.status) {
        case 200:
          setToken(res.data.access_token)
          commit('SET_ACCESS_TOKEN', res.data.access_token)
          commit('SET_REFRESH_TOKEN', res.data.refresh_token)
          resUserInfo = await getData(`admin/user/info`).catch(err => {
            commit('GLOBAL_ERR', err, {root: true})
          })
          console.log("res2", resUserInfo)
          res.data.user = resUserInfo.data.data.sysUser
          commit(mt.SET_USER, resUserInfo.data.data.sysUser)
          commit('SET_PERMISSIONS', resUserInfo.data.data.permissions)
          break
        default:
          break
      }

      return resUserInfo.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async logout({commit}) {
    try {
      let res = await postData(`auth/oauth/removeToken`, {}).catch(err => {
        commit('GLOBAL_ERR', err, {root: true})
      })
      switch (res.data.code) {
        case 0:
          // 清除菜单
          commit('SET_MENU', [])
          // 清除权限
          commit('SET_PERMISSIONS', [])
          // 清除用户信息
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          commit(mt.REMOVE_USER)
          break
        default:
          break
      }

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async checkPwd({commit}, obj) {
    try {
      let res = await postData(`/system/checkPwd`, obj).catch(err => {
        commit('GLOBAL_ERR', err, {root: true})
      })

      switch (res.data.code) {
        case 0:
          break
        default:
          break
      }

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async chgPwd({commit}, obj) {
    try {
      let res = await putData(`/admin/user/editInfo`, obj).catch(err => {
        commit('GLOBAL_ERR', err, {root: true})
      })
      switch (res.data.status) {
        case 0:
          break
        default:
          break
      }

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  }
}

const mutations = {
  ['SET_ACCESS_TOKEN'](state, access_token) {
    state.access_token = access_token
    setStore({
      name: 'access_token',
      content: state.access_token,
      type: 'session'
    })
  },
  ['SET_REFRESH_TOKEN'](state, rfToken) {
    state.refresh_token = rfToken
    setStore({
      name: 'refresh_token',
      content: state.refresh_token,
      type: 'session'
    })
  },
  ['SET_MENU']: (state, menu) => {
    state.menu = menu
    setStore({
      name: 'menu',
      content: state.menu,
      type: 'session'
    })
  },
  ['SET_USER_INFO']: (state, userInfo) => {
    state.userInfo = userInfo
    setStore({
      name: 'userInfo',
      content: state.userInfo,
      type: 'session'
    })
  },
  ['SET_REFRESH_TOKEN']: (state, rfToken) => {
    state.refresh_token = rfToken
    setStore({
      name: 'refresh_token',
      content: state.refresh_token,
      type: 'session'
    })
  },
  ['SET_ROLES']: (state, roles) => {
    state.roles = roles
    setStore({
      name: 'roles',
      content: state.roles,
      type: 'session'
    })
  },
  ['SET_PERMISSIONS']: (state, permissions) => {
    const list = {}
    for (let i = 0; i < permissions.length; i++) {
      list[permissions[i]] = true
    }
    state.permissions = list
    setStore({
      name: 'permissions',
      content: state.permissions,
      type: 'session'
    })
  },
  [mt.SET_USER](state, user) {
    state.user = user.name
    state.avatar = '/assets/static/images/avatar.jpg'
  },
  [mt.REMOVE_USER](state, vm) {
    Cookies.remove('user')
    Cookies.remove('access')
    // 恢复默认样式
    let themeLink = document.querySelector('link[name="theme"]')
    themeLink.setAttribute('href', '')
    // 清空打开的页面等数据，但是保存主题数据
    let theme = ''
    if (localStorage.theme) {
      theme = localStorage.theme
    }
    if (theme) {
      localStorage.theme = theme
    }
  },
// ['ADD_TAG'](state, action)
// {
//   state.tag = action;
//   setStore({name: 'tag', content: state.tag, type: 'session'})
//   if (state.tagList.some(a => a.value === action.value)) return
//   state.tagList.push({
//     label: action.label,
//     value: action.value,
//     query: action.query,
//   })
//   state.tagList = setFistTag(state.tagList);
//   setStore({name: 'tagList', content: state.tagList, type: 'session'})
// },
}

export default {
  state,
  getters,
  actions,
  mutations
}
