import store from '../../store'
const log = true 
const state = {
  dashBoard: [],
  moquiToken: '',
  user: {
    partyId: '',
    userId: '',
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    locale: '',
    userGroupId: '',
    groupDescription: ''
  },
  users: [],
  company: {
    name: '',
    id: '',
    currency: '',
    email: '',
    img: ''
  },
  userGroups:[],
  dashboard: [],
  customerProvider: [],
  activeSubscriptions: [],
}
const mutations = { //synchronous
  activeSubscriptions(state, value) {
    state.activeSubscriptions = value 
  },
  moquiToken(state, value) {
      state.moquiToken = value 
  },
/*
  user(state, value) {
      appSettings.setString('username', value.name)
      state.user = value
  },
  username(state,value) {
      state.user.name = value
      appSettings.setString('username', value)
  },
  users(state, value) {
      state.users = value
  },
*/}
const getters = {
  activeSubscriptions: state => {
      return state.activeSubscriptions
  },
/*  customerProvider: state => {
    return state.customerProvider
  },
*/  isSubActive: state => playStoreId => {
    let isActive = false
    for (let i=0;i<state.activeSubscriptions.length;i++) {
      if (state.activeSubscriptions[i] === playStoreId) {
        isActive = true; break }}
    return isActive
  },
  moquiToken: state => {
    return state.moquiToken
  },
/*  user: state => { 
    return state.user },
  userNames: state => {
    var names = []
    names.push(' ')
    for(let i=0;i < state.users.length;i++)
        names.push(state.users[i].firstName + ' ' + state.users[i].lastName)
    return names
  },
  userByFirstLastName: state => fullName => {
      for (let i= 0; i < state.users.length;i++) {
        if (state.users[i].firstName + ' ' +
              state.users[i].lastName === fullName) {
          return state.users[i].partyId}}
  },
  users: state => {
    return state.users
  },
  userGroups: state => {
    return state.userGroups
  },
*/}
// export this module.
export default {
  state,
  mutations,
  getters
}
