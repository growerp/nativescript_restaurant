import store from '~/store'
import axios from 'axios'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()

const appSettings = require('tns-core-modules/application-settings')
var log = true 
// if (TNS_ENV === 'production') log = false

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
  image(state, value) {
    let item = null
    switch (value.type) {
      case 'product':
        item = store.getters.productById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('product', item)
        break
      case 'category':
        item = store.getters.productCategoryById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('productCategory', item)
        break
      case 'area':
        item = store.getters.accommodationAreaById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('accommodationArea', item)
        break
      case 'prep':
        item = store.getters.preparationAreaById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('preparationArea', item)
        break
      case 'task':
          item = store.getters.taskById(value.id)
          item.image =  value.image
          item.verb = 'update'
          store.commit('task', item)
          break
        case 'user':
        item = store.getters.employeeById(value.id)
        if (item == -1) item = store.getters.customerById(value.id)
        if (item == -1) log?console.log('party not found!'):''
        else {
          item.image =  value.image
          item.verb = 'update'
          if (item.roleTypeId == 'Customer')
            store.commit('customer', item)
          if (item.roleTypeId == 'Employee')
            store.commit('employee', item) }
        break
    }
  }
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
const actions = {
  async getConnection({ commit, dispatch }) {
    console.log ('===getConnection: checking ==ping')
    try {
      let result = await backendService.ping() // check if server present
      if (result.data && result.data.ok === 'ok') {
        log? console.log('=== getConnection: ping is ok now getting token....'):''
        let resultToken = await backendService.getToken()
        log?console.log("==== conn token received: " + resultToken.data):''
        backendService.saveToken(resultToken.data)
        log? console.log('=== getConnection: moqui token is ok....'):''
        if (appSettings.hasKey('apiKey')) { // skip login when have api_key
          log? console.log("====getConnection: api key found: " + 
              appSettings.getString('apiKey')):''
          backendService.saveKey(appSettings.getString('apiKey')) // save it in the API
          try{
            result = await backendService.checkApiKey() // check if apiKey still valid
            if (result && result.data && result.data.ok === 'ok') {
              log? console.log('==== getConnection: checkApiKey is fine.'):''
              return 'success'
            } else { // server key wrong so delete it and login again
              backendService.removeKey()
              log?console.log('==== getConnection: apiKey failed, needs logging in'):''
              return 'noApiKey'
            }
          } catch(error) {
            log? console.log('==== getConnection: check apiKey catch'):''
            return "message:" + error.response.data.errors }
        } else {
          log? console.log("=== No current ApiKey found"):''
          return 'noApiKey'}
      } else {
        log? console.log("==== getConnection:  No valid return from ping"):''
      }
    } catch(error) {
      log? console.log('==== getConnection: ping catch server problem: '
         + error):''
      return "serverProblem" }
  },
  async login({}, user) {
    log? console.log("==== login: store start logging in"):''
    user.name = user.name.toLowerCase().trim()
    appSettings.setString('username', user.name)
    try {
      let result = await backendService.login(user)
      if (result ) {
        if (result.data.passwordChange) {
          log? console.log('==== login change password'):''
          return 'passwordChange'
        } else if (result.data.apiKey) { // if apiKey present = logged in
          log? console.log("==== login api key received key: " + result.data.apiKey):''
          backendService.saveKey(result.data.apiKey)
          backendService.saveToken(result.data.moquiSessionToken)
          return 'success' }}
    } catch(error) {
      return "message:" + error.response.data.errors }
  },
  async register({commit}, input) {
    input.user.emailAddress = input.user.emailAddress.toLowerCase().trim()
    input.user.name = input.user.emailAddress
    try {
      let response = await backendService.register(input.user, input.company)
      if (response && response.data) { 
        appSettings.clear() // start fresh
        appSettings.setString('username', input.user.name)
        return 'success'
      }
    } catch(error) {
        return "message:" + error.response.data.errors }
  },
  async initialData({commit}) {
    await backendService.initialData()
    .then(axios.spread (function ( GetCurrentEmployeeUserGroupId,
      GetActiveSubscriptions, GetAccommodationAreas, GetAccommodationSpots) {
        commit('currentEmployeeUserGroupId',
          GetCurrentEmployeeUserGroupId.data.currentEmployeeUserGroupId)
        commit('activeSubscriptions',
          GetActiveSubscriptions.data.subscriptions)
        commit('accommodationAreas',
          GetAccommodationAreas.data.accommodationAreas)
        commit('accommodationSpots',
          GetAccommodationSpots.data.accommodationSpots)
      }))
  },
  async initData({commit}) {
    await backendService.initData()
    .then(axios.spread (function ( GetCurrentEmployeeUserGroupId, 
      GetActiveSubscriptions, GetPreparationAreas,
      GetAccommodationAreas, GetAccommodationSpots, GetProductCategories,
      GetProducts, GetOrdersAndItemsByPrepAreas, GetOrders,
      GetAllPartyInfo, GetMyTasks, GetRequests) {
        commit('currentEmployeeUserGroupId',
          GetCurrentEmployeeUserGroupId.data.currentEmployeeUserGroupId)
        commit('activeSubscriptions',
          GetActiveSubscriptions.data.subscriptions)
        commit('preparationAreas',
          GetPreparationAreas.data.preparationAreas)
        commit('accommodationAreas',
          GetAccommodationAreas.data.accommodationAreas)
        commit('accommodationSpots',
          GetAccommodationSpots.data.accommodationSpots)
        commit('productCategories',
          GetProductCategories.data.productCategories)
        commit('products',GetProducts.data.products)
        commit('ordersAndItemsByPrepAreas',
          GetOrdersAndItemsByPrepAreas.data.ordersAndItemsByPrepAreas)
        commit('openOrders',
          GetOrders.data.ordersAndItems),
        commit('allPartyInfo', GetAllPartyInfo.data),
        commit('tasks', GetMyTasks.data),
        commit('requests', GetRequests.data)
      }))
  },
  async loadDefaultData({}, t) { // t = list translated areas
    await backendService.loadDefaultData(TNS_ENV, t)
  }
}

// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
