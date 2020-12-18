import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, getUserId, removeUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: '',
    phone: '',
    intro: '',
    id:getUserId(),
    userinfo: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_INTRO: (state, intro) => {
    state.intro = intro
  },
  SET_USER_ID: (state, id) => {
    state.id = id
  },
  SET_USER_INFO: (state, userinfo) => {
    state.userinfo = userinfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
    commit('SET_USER_ID', data.user_id)
        setUserId(data.user_id);
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({user_id: state.id, token: state.token}).then(response => {
        delete response.data.roles
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { username, avatar, phone, intro } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_PHONE', phone)
        commit('SET_INTRO', intro)
        commit('SET_USER_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({user_id: state.id, token: state.token}).then(() => {
        removeToken() // must remove  token  first
        removeUserId()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUserId()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

