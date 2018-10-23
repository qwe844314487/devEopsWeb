import { loginByUsername,fetch_UserInfo } from "@/api/login";
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    user: '',
    token: getToken(),
    name: '',
    islogin: false,
    dber: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_LOGIN: (state, islogin) =>{
      state.islogin = islogin
    },
    SET_USERNAME: (state, username) =>{
      state.username = username
    },
    SET_NAME: (state, name) =>{
      state.name = name
    },
    SET_DBER: (state) => {
      state.dber = !state.dber
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    DBER({commit}){
      commit('SET_DBER')
    },
    
    UserInfo({commit}){
      return new Promise((resolve,reject) => {
        fetch_UserInfo().then((response) => {
          commit('SET_LOGIN', true)
          commit('SET_USERNAME', response.data.username)
          commit('SET_NAME', response.data.name)
          commit('SET_INFO', response.data.info)
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    },

    // 用户名登录
    LoginByUsername({ commit }, userForm) {
      const username = userForm.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userForm.password).then((response) => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve) => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
