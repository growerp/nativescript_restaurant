const log = true 
const state = {
  apiKey: '',
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
  openOrders: [],
  activeSubscriptions: [],
}
const appSettings = require("tns-core-modules/application-settings")

const mutations = { //synchronous
  activeSubscriptions(state, value) {
    state.activeSubscriptions = value 
  },
  apiKey(state, value) {
    state.apiKey = value
    if (value) appSettings.setString('apiKey', value)
    else appSettings.remove('apiKey')
  },
  appSettings(state, value) {
    state.apiKey = value.apiKey
    state.company.name = value.companyname
    state.user.name = value.username
  },
  company(state, value) {
    state.company = value
    appSettings.setString('companyname', value.name)
  },
  customerProvider(state, value) {
    state.customerProvider = value },
  moquiToken(state, value) {
      state.moquiToken = value 
  },
  openOrders(state, value) {
    state.openOrders = value 
  },
  userGroups(state, value) {
    state.userGroups = value 
  },
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
}
const getters = {
  activeSubscriptions: state => {
      return state.activeSubscriptions
  },
  company: state => {
    return state.company
  },
  customerProvider: state => {
    return state.customerProvider
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
  openOrders: state => {
    return state.openOrders
  },
  openOrdersByAreaSpot: state => (areaId, spotId) => {
    let openOrders = []
    for (let i=0; i<state.openOrders.length;i++) {
      if (state.openOrders[i].accommodationAreaId === areaId &&
          state.openOrders[i].accommodationSpotId === spotId)
        openOrders.push(state.openOrders[i])}
    return openOrders
  },
  user: state => { 
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
  apiKey: state => {
      return state.apiKey
  },
  userGroups: state => {
    return state.userGroups
  },
  userGroupValues: state => {
    let values = []
    values.push(' ')
    for(let i=0;i < state.userGroups.length;i++)
      values.push(state.userGroups[i].description)
    return values
  },
}
// export this module.
export default {
  state,
  mutations,
  getters
}
