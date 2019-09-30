import store from '../../store'
const log = true 
const state = {
  moquiToken: '',
  activeSubscriptions: [],
}
const mutations = { //synchronous
  activeSubscriptions(state, value) {
    state.activeSubscriptions = value 
  },
  moquiToken(state, value) {
      state.moquiToken = value 
  },
}
const getters = {
  activeSubscriptions: state => {
      return state.activeSubscriptions
  },
  isSubActive: state => playStoreId => {
    let isActive = false
    for (let i=0;i<state.activeSubscriptions.length;i++) {
      if (state.activeSubscriptions[i] === playStoreId) {
        isActive = true; break }}
    return isActive
  },
  moquiToken: state => {
    return state.moquiToken
  },
}
// export this module.
export default {
  state,
  mutations,
  getters
}
