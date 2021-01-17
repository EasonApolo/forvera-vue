import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    token: undefined,
    login: false,
    user: {
      info: {}
    }
  },
  mutations: {
    setToken (state, newToken) {
      localStorage.token = newToken
      state.token = newToken
    },
    login (state, status) {
      state.login = status
    },
    setUserInfo (state, userInfo) {
      state.user.info = userInfo
    }
  },
  getters: {
    userInfo: state => {
      return state.user.info
    }
  }
})