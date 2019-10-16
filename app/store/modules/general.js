import store from '../../store'
import axios from 'axios'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
import { images } from '~/assets/imagesBase64'

const appSettings = require('tns-core-modules/application-settings')
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
    log? console.log('===store dispatch starting======'):''
    log? console.log ('===checking ==ping'):''
    try {
      let result = await backendService.ping() // check if server present
      if (result.data && result.data.ok === 'ok') {
        log? console.log('=== ping is ok now getting token....'):''
        let resultToken = await backendService.getToken()
        commit('moquiToken', resultToken.data)
        backendService.saveToken(resultToken.data)
        log?console.log('=== moqui token is ok....'):''
        if (!appSettings.getString('username')) {
          log?console.log('===using for the first time:show register screen'):''
          return 'register'
        }
        if (appSettings.getString('apiKey')) { // skip login when have api_key
          log?console.log('api key found: ' + appSettings.getString('apiKey')):''
          backendService.saveKey(appSettings.getString('apiKey')) // save it in the API
          try {
            result = await backendService.checkApiKey() // check if apiKey still valid
            if (result.data.ok === 'ok') {
              log?console.log('===checkApiKey is fine, so connection fine...'):''
              return 'success'
            } else { // server key wrong so delete it and login again
              appSettings.remove('apiKey')
              return 'noApiKey'}
          }
          catch( error ) {
            log?console.log('====Api key invalid, catch error:' + 
                JSON.stringify(error)):''
            appSettings.remove('apiKey')
            return 'noApiKey'}
        } else {
          log?console.log('=== No current ApiKey found'):''
          return 'noApiKey'}
      } else {
        log?console.log('=== Ping does not return ok'):''
        return 'serverProblem'}
    }
    catch( error ) {
      log?console.log('=========ping catch: ' + error.message):''
      return 'serverProblem'}
  },
  async login({ commit}, user) {
    log? console.log('store start logging in'):''
    try {
      let result = await backendService.login(user)
      if (result.status == null) {
        return 'serverProblem'
      } else if (result.data.passwordChange) {
        return 'passwordChange'
      } else if (result.data.apiKey) { // if apiKey present = logged in
          log? console.log('===api key present from login'):''
          backendService.saveKey(result.data.apiKey)
          appSettings.setString('apiKey', result.data.apiKey)
          commit('moquiToken', result.data.moquiSessionToken)
          backendService.saveToken()
          return 'success'
      } else {
          return 'accountNotFound'
      }
    } catch(error) {
      log? console.log('====login catch error' + error.errors):''
      return error.errors? error.errors : 'serverProblem'}
  },
  async register({commit}, input) {
    try {
      let response = await backendService.register(input.user, input.company)
      if (!response.data.user) return 'registerError'
      appSettings.clear() // start fresh
      appSettings.setString('username', input.user.name)
      return 'success'
    } catch( error ) {
      if (error.response.data.errors.indexOf('Found issues with password') !== -1) {
        return 'passwordRequirement'
      } else {
        return 'regError' + error.response.data.errors
      }
    }
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
  loadDefaultData({state}, t) {
    if (TNS_ENV === 'production') {
      let item = {}
      item.description = t[0]
      backendService.createPreparationArea(item).then( result => {
        backendService.uploadImage('small', images.kitchenImageSmall, 'prep', result.data.preparationAreaId)
        backendService.uploadImage('medium', images.kitchenImageMedium, 'prep', result.data.preparationAreaId)
        item.categoryName = t[1] ; item.preparationAreaId = result.data.preparationAreaId
        backendService.createCategory(item).then( result => {
          backendService.uploadImage('small', images.foodImageSmall, 'category', result.data.productCategoryId)
          backendService.uploadImage('medium', images.foodImageMedium, 'category', result.data.productCategoryId)
          backendService.createProduct({ name: t[2], price: 6.20, productCategoryId: result.data.productCategoryId})
          .then( result => {
            backendService.uploadImage('small', images.macaroniImageSmall, 'product', result.data.productId)
            backendService.uploadImage('medium', images.macaroniImageMedium, 'product', result.data.productId)
      })})})
      item.description = t[3]
      backendService.createPreparationArea(item).then( result => {
        backendService.uploadImage('small', images.barImageSmall, 'prep', result.data.preparationAreaId)
        backendService.uploadImage('medium', images.barImageMedium, 'prep', result.data.preparationAreaId)
        item = { categoryName: t[4], preparationAreaId: result.data.preparationAreaId }
        backendService.createCategory(item).then( result => {
          backendService.uploadImage('small', images.drinksImageSmall, 'category', result.data.productCategoryId)
          backendService.uploadImage('medium', images.drinksImageMedium, 'category', result.data.productCategoryId)
          backendService.createProduct({ name: t[8], price: 80, productCategoryId: result.data.productCategoryId})
          .then( result => {
            backendService.uploadImage('small', images.colaImageSmall, 'product', result.data.productId)
            backendService.uploadImage('medium', images.colaImageMedium, 'product', result.data.productId)
      })})})
      // accomodation area and spot(table)
      let area = { description: t[5], nbrOfSpots: '10'}
      backendService.createAccommodationArea(area).then( result => {
        backendService.uploadImage('small', images.insideImageSmall, 'area', result.data.accommodationAreaId)
        backendService.uploadImage('medium', images.insideImageMedium, 'area', result.data.accommodationAreaId)})
      area = {description: t[6], nbrOfSpots: '15'}
      backendService.createAccommodationArea(area).then( result => {
        backendService.uploadImage('small', images.outsideImageSmall, 'area', result.data.accommodationAreaId)
        backendService.uploadImage('medium', images.outsideImageMedium, 'area', result.data.accommodationAreaId)})
    } else { // from here test data
    let item = {}
    item.description = t[0]
    backendService.createPreparationArea(item).then( result => {
      backendService.uploadImage('small', images.kitchenImageSmall, 'prep', result.data.preparationAreaId)
      backendService.uploadImage('medium', images.kitchenImageMedium, 'prep', result.data.preparationAreaId)
      item.categoryName = t[1] ; item.preparationAreaId = result.data.preparationAreaId
      backendService.createCategory(item)
      .then( result => {
        backendService.uploadImage('small', images.foodImageSmall, 'category', result.data.productCategoryId)
        backendService.uploadImage('medium', images.foodImageMedium, 'category', result.data.productCategoryId)
        backendService.createProduct({ name: t[2], price: 6.20, productCategoryId: result.data.productCategoryId})
        .then( result => {
          backendService.uploadImage('small', images.macaroniImageSmall, 'product', result.data.productId)
          backendService.uploadImage('medium', images.macaroniImageMedium, 'product', result.data.productId)})
        backendService.createProduct({name: 'french fries', price: 2.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Tomjamkuhn', price: 3.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Cheese plate', price: 4.99, productCategoryId: result.data.productCategoryId})})
    })
    item.description = 'Bar'
    backendService.createPreparationArea(item).then( result => {
      backendService.uploadImage('small', images.barImageSmall, 'prep', result.data.preparationAreaId)
      backendService.uploadImage('medium', images.barImageMedium, 'prep', result.data.preparationAreaId)
      item.categoryName = 'Sodas' ; item.preparationAreaId = result.data.preparationAreaId
      backendService.createCategory(item).then( result => {
        backendService.uploadImage('small', images.drinksImageSmall, 'category', result.data.productCategoryId)
        backendService.uploadImage('medium', images.drinksImageMedium, 'category', result.data.productCategoryId)
          backendService.createProduct({ name: t[8], price: 80, productCategoryId: result.data.productCategoryId})
        .then( result => {
          backendService.uploadImage('small', images.colaImageSmall, 'product', result.data.productId)
          backendService.uploadImage('medium', images.colaImageMedium, 'product', result.data.productId)})
        backendService.createProduct({name: 'fanta', price: 6.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Pepsi', price: 7.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Smoothy', price: 8.99, productCategoryId: result.data.productCategoryId})})
      item.categoryName = 'Beers and Liquor'
      backendService.createCategory(item)
      .then( result => {
        backendService.createProduct({name: 'Best Beer', price: 11.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Wiskey', price: 21.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'Red Wine', price: 31.99, productCategoryId: result.data.productCategoryId})
        backendService.createProduct({name: 'White wine', price: 41.99, productCategoryId: result.data.productCategoryId})})
    })
    let area = { description: 'Inside', nbrOfSpots: '10'}
    backendService.createAccommodationArea(area).then( result => {
      backendService.uploadImage('small', images.insideImageSmall, 'area', result.data.accommodationAreaId)
      backendService.uploadImage('medium', images.insideImageMedium, 'area', result.data.accommodationAreaId)})
    area = { description: 'Outside', nbrOfSpots: '15'}
    backendService.createAccommodationArea(area).then( result => {
      backendService.uploadImage('small', images.outsideImageSmall, 'area', result.data.accommodationAreaId)
      backendService.uploadImage('medium', images.outsideImageMedium, 'area', result.data.accommodationAreaId)})

    // add users and todo tasks only test
    const random = Math.random().toString(36).substring(2, 15) + 
          Math.random().toString(36).substring(2, 15);
    let user1 = {firstName: 'Peter', lastName: 'Coster',
        emailAddress: random + '@example.com',roleTypeId: 'Employee', groupDescription: 'Employee'}
    backendService.createUser(user1).then( result => {
      let item = { workEffortName:'This a first task',
                partyId: result.data.user.partyId,priority: '5'}
      backendService.createTask(item)})

    const random1 = Math.random().toString(36).substring(2, 15) + 
            Math.random().toString(36).substring(2, 15);
      let user2 = {firstName: 'Kevin', lastName: 'Junker',
        emailAddress: random1 + '@example.com',roleTypeId: 'Employee', groupDescription: 'Employee'}
    backendService.createUser(user2).then( result => {
      let item2 = { workEffortName:'This a second task',
                partyId: result.data.user.partyId , priority: '5'}
      backendService.createTask(item2)})

    let item3 = { workEffortName:'This a third task for me', priority: '5'}
    backendService.createTask(item3)
    item3 = { workEffortName:'This a fourth task to me'}
    backendService.createTask(item3)
    // customer
    const random2 = Math.random().toString(36).substring(2, 15) + 
            Math.random().toString(36).substring(2, 15);
    user2 = {firstName: 'Steven', lastName: 'Customer',
        emailAddress: random2 + '@example.com',roleTypeId: 'Customer',
        image: '~/assets/images/addImage.png', externalId: '99999'}
    backendService.createUser(user2)
    }
  }
}

// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
