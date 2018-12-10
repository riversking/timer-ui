import * as mt from '../mutation-types'
import { getData, postData, err } from '../../libs/fetchData'

const state = {
  count: {},
  error: [],
  currentClosePage: [],
}

const getters = {

}

const actions = {
  async count({ commit }) {
    try {
      let res = await getData(`system/count`)

      switch (res.data.code) {
        case 0:
          commit(mt.SET_MODEL, res.data.count)
          break
        default:
          break
      }

      return res.data
    } catch (error) {
      console.log('error: ', error)
    }
  },
  async delFile({ commit }, obj) {
    try {
      let res = await postData(`system/delFile`, obj)

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
  }
}

const mutations = {
  [mt.SET_MODEL](state, payload) {
    payload.arc = parseInt(payload.arc, 10) || 0
    payload.fl = parseInt(payload.fl, 10) || 0
    payload.ad = parseInt(payload.ad, 10) || 0
    payload.logs = parseInt(payload.logs, 10) || 0
    state.count = payload
  },
  ['CLOSE_PAGE'] (state, pageName) {
    state.currentClosePage = []
    state.currentClosePage.push(pageName)
  },
  ['GLOBAL_ERR'] (state, err) {
    state.error = []
    state.error.push(err)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
