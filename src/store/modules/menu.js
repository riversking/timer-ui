import * as mt from '../mutation-types'
import { postData, pageSize } from '../../libs/fetchData'

const namespace = '/api/v1/user/menu'

const state = {
  loading: true,
  total: 0,
  query: {
    page: 1,
    pageSize: pageSize,
    keywords: '',
    sortKey: 'id',
    sortOrder: 'desc'
  },
  listData: [],
  menuModel: [],
  widget: {},
  permission: {}
}

const getters = {}

const actions = {
  async getListData ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/getMenuTree`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          commit(mt.SET_LIST_DATA, res.data)
          break
        default:
          break
      }

      commit(mt.SET_LOADING, false)

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async getMenuByRoleId ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/getMenuByRoleId`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          commit('MENU_BY_ROLE_ID', res.data)
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async getMenuByUserId ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/getMenuByUserId`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      console.log('resresresresresresres', res.data.datas)
      switch (res.status) {
        case 200:
          commit('MENU_BY_ROLE_ID', res.data)
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async updateByRoleId ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/updateByRoleId`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async add ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/addMenu`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async read ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/getMenuById`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          commit(mt.SET_MODEL, res.data)
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)
      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async delete ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/deleteMenu`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)
      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async update ({ commit }, obj) {
    try {
      commit(mt.SET_LOADING, true)
      let res = await postData(`${namespace}/updateMenu`, obj).catch(err => {
        commit('GLOBAL_ERR', err, { root: true })
      })
      switch (res.status) {
        case 200:
          break
        default:
          break
      }
      commit(mt.SET_LOADING, false)
      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  }
}

const mutations = {
  [mt.SET_LOADING] (state, bool) {
    state.loading = bool
  },
  [mt.SET_LIST_DATA] (state, payload) {
    console.log(payload.rsp)
    state.listData = payload.datas
    // state.permission = payload.permission
  },
  [mt.SET_MODEL] (state, payload) {
    console.log('payload', payload)
    state.menuModel = payload.datas
    // state.widget.authList = payload.widget.authList
  },
  ['SET_MENU_LIST'] (state, payload) {
    state.listData = payload.datas
  },
  ['MENU_BY_ROLE_ID'] (state, payload) {

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
