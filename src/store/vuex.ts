import { createStore } from 'vuex'

const store = createStore({
  state: {
    successMessage: null,
    errorMessage: null,
    isSidebarMinimized: false,
    userName: 'Vasili S',
  },
  mutations: {
    toggleSidebar(state) {
      state.isSidebarMinimized = !state.isSidebarMinimized
    },
    changeUserName(state, userName) {
      state.userName = userName
    },
    setSuccessMessage(state, message) {
      state.successMessage = message
    },
    setErrorMessage(state, message) {
      state.errorMessage = message
    },
    clearMessages(state) {
      state.successMessage = null
      state.errorMessage = null
    },
  },
  actions: {
    clearMessages({ commit }) {
      commit('clearMessages')
    },
  },
  modules: {},
})

export default store
