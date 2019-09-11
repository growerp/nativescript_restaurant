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
  areasAndSpots:[],
  products: [],
  categoriesAndProducts: [],
  prepAreasAndCategories: [],
  dashboard: [],
  customerProvider: [],
  openOrders: [],
  activeSubscriptions: [],
}
const appSettings = require("tns-core-modules/application-settings")

const mutations = { //synchronous
  customerProvider(state, value) {
    state.customerProvider = value },
  activeSubscriptions(state, value) {
      state.activeSubscriptions = value },
  openOrders(state, value) {
      state.openOrders = value },
  categoriesAndProducts(state, value) {
    state.categoriesAndProducts = value 
    state.products = [] // create also a products list
    for(let i=0;i < value.length;i++) {
      for(let p=0;p < value[i].products.length;p++) {
        state.products.push({
          productId: value[i].products[p].productId,
          name: value[i].products[p].name,
          price: value[i].products[p].price,
          image: value[i].products[p].image,
          productCategoryId: value[i].productCategoryId,
          categoryName: value[i].name,})
    }}
    state.products.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
  },
  categoryAndProduct(state, value) {
    //  update/add category and category.products[{product}], if category change oldProductCatgoryId required
    // if product delete: provide only oldProductCategoryId and productId, no productCategoryId
    // if product add: provide only productCategoryId and productId with data
    // if product mod: provide oldProductCategoryId AND productCategoryId and productId with data
    // Only category update, just provide category info, no products
    if (log) console.log('====categoryAndProduct incoming value: ' + JSON.stringify(value))
    if (value.products) { // update the products file
      if (log) console.log("=====update products file...")
      let prodFileIndex = state.products.findIndex(
          o => o.productId === value.products[0].productId)
      if (prodFileIndex != -1) {
        if (log) console.log("====product found")
        if (value.oldProductCategoryId && !value.productCategoryId) {
          if (log) console.log("===product delete: " + value.products[0].name)
          state.products.splice(prodFileIndex,1)// delete
        } else { // modify
          let product = state.products[prodFileIndex]
          if (value.oldProductCategoryId && value.productCategoryId) { // category
            if (log) console.log("===product file: category modify for product: " + 
                state.products[prodFileIndex].name)
            product.productCategoryId = value.productCategoryId
            product.categoryName = state.categoriesAndProducts.find(
                o => o.productCategoryId === value.productCategoryId).name
          }
          if (value.products[0].name) { //other fields
            if (log) console.log("===product file descr/price/image modify: " + 
                value.products[0].name)
            product.name = value.products[0].name 
            product.price = value.products[0].price 
            product.image = value.products[0].image
          } 
          state.products.splice(prodFileIndex,1, product) // modify
        }
      } else {
        if (log) console.log("===add product: " + value.products[0].name)
        state.products.push(value.products[0]) // add
      }
      if (log) console.log('sorting products file')
      state.products.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      });
    }
    if (log) console.log("===updating categoriesAndProducts")
    let catIndex = -1;let prodIndex = -1; let category = {}
    if (value.oldProductCategoryId && !value.products) { //remove oldCategory without products
      catIndex = state.categoriesAndProducts.findIndex(
        o => o.productCategoryId === value.oldProductCategoryId)
      if (log) console.log("====delete category: " + state.categoriesAndProducts[catIndex].name)
      state.categoriesAndProducts.splice(catIndex,1)
    }
    if (value.oldProductCategoryId && value.products) { //remove product from oldCategory and copy prod data
      catIndex = state.categoriesAndProducts.findIndex(
        o => o.productCategoryId === value.oldProductCategoryId)
      if (log) console.log("====seraching for " + value.products[0].productId + " in " + 
            JSON.stringify(state.categoriesAndProducts[catIndex].products))
      prodIndex = state.categoriesAndProducts[catIndex].products.findIndex(
          o => o.productId === value.products[0].productId)
      if (prodIndex != -1) {            
        if (log) console.log("===remove product found:" + 
            state.categoriesAndProducts[catIndex].products[prodIndex].name)
        if (!value.products[0].name) 
          value.products[0].name = state.categoriesAndProducts[catIndex]
          .products[prodIndex].name
        if (!value.products[0].price)
          value.products[0].price = state.categoriesAndProducts[catIndex]
          .products[prodIndex].price
        if (!value.products[0].image)
          value.products[0].image = state.categoriesAndProducts[catIndex]
          .products[prodIndex].image
        state.categoriesAndProducts[catIndex].products.splice(prodIndex,1)
        if (log) console.log('====after update incoming value: ' + 
            JSON.stringify(value))
      } 
    }
    if (value.productCategoryId) {
      if (!value.products) value.products = [] 
      catIndex = state.categoriesAndProducts.findIndex(
        o => o.productCategoryId === value.productCategoryId)
      if (catIndex != -1) {
        if (log) console.log("===category found: " + 
          state.categoriesAndProducts[catIndex].name)
        if (!value.name) value.name = 
            state.categoriesAndProducts[catIndex].name
        if (!value.image) value.image = 
            state.categoriesAndProducts[catIndex].image
        if (!value.preparationAreaId) value.preparationAreaId = 
            state.categoriesAndProducts[catIndex].preparationAreaId
        if (!value.description) value.description = 
            state.categoriesAndProducts[catIndex].description
        if (value.products.length) { // add or update products
          if (log) console.log("====searching for product " 
              + value.products[0].productId + " in " + 
              JSON.stringify(state.categoriesAndProducts[catIndex].products))
          prodIndex = state.categoriesAndProducts[catIndex].products.findIndex(
              o => o.productId === value.products[0].productId)
          if (prodIndex != -1) { // remove existing product
            if (log) console.log("===remove product found:" + 
                state.categoriesAndProducts[catIndex].products[prodIndex].name)
            state.categoriesAndProducts[catIndex].products.splice(prodIndex,1)
          }
        }
        value.products = value.products.concat(
            state.categoriesAndProducts[catIndex].products)
        if (log) console.log('====after merging existing category products value: '
              + JSON.stringify(value))
        if (log) console.log('====products of cat to sort: ' + 
            JSON.stringify(value.products))
        value.products.sort(function (a, b) { // sort products of category
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
        state.categoriesAndProducts.splice(catIndex,1,value) // update existing catg/product
      } else {
        state.categoriesAndProducts.push(value) // new category
      }
      if (log) console.log('====cat to sort: ' + 
          JSON.stringify(state.categoriesAndProducts))
      state.categoriesAndProducts.sort(function (a, b) { // sort categories
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
    }
  },
  areasAndSpots(state, value) {
    state.areasAndSpots = value 
  },
  userGroups(state, value) {
    state.userGroups = value 
  },
  prepAreasAndCategories(state, value) {
    state.prepAreasAndCategories = value
  },
  apiKey(state, value) {
      state.apiKey = value
      if (value) appSettings.setString('apiKey', value)
      else appSettings.remove('apiKey')
  },
  moquiToken(state, value) {
      state.moquiToken = value 
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
  company(state, value) {
      state.company = value
      appSettings.setString('companyname', value.name)
  },
  appSettings(state, value) {
      state.apiKey = value.apiKey
      state.company.name = value.companyname
      state.user.name = value.username
  }
}
const getters = {
  customerProvider: state => {
    return state.customerProvider
  },
  openOrders: state => {
      return state.openOrders
  },
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
  openOrdersByAreaSpot: state => (areaId, spotId) => {
    let openOrders = []
    for (let i=0; i<state.openOrders.length;i++) {
      if (state.openOrders[i].accommodationAreaId === areaId &&
          state.openOrders[i].accommodationSpotId === spotId)
        openOrders.push(state.openOrders[i])}
    return openOrders
  },
  categoriesAndProducts: state => {
    return state.categoriesAndProducts
  },
  categoriesAndProductsCount: state => {
    let categories = []
    for (let i = 0; i < state.categoriesAndProducts.length;i++) {
      categories.push( { 
        productCategoryId: state.categoriesAndProducts[i].productCategoryId,
        name: state.categoriesAndProducts[i].name,
        image: state.categoriesAndProducts[i].image,
        preparationAreaId: state.categoriesAndProducts[i].preparationAreaId,
        description: state.categoriesAndProducts[i].description,
        nbrOfProducts: state.categoriesAndProducts[i].products.length,
      })}
    return categories 
  },
  categoryAndProductsByDesc: (state) => (desc) => {
    return state.categoriesAndProducts.find(o => o.name === desc)},
  categoryAndProductsById: state => id => {
    if (log) console.log('====requested categoryId:' + id + 
        'result: ' + JSON.stringify(state.categoriesAndProducts.find(
            o => o.productCategoryId === id)))
    return state.categoriesAndProducts.find(o => o.productCategoryId === id)
  },
  categories: state => (blank=true) => {
    let categories = []
    if (blank) categories.push(' ')
    for(let i=0;i < state.categoriesAndProducts.length;i++) {
        categories.push(state.categoriesAndProducts[i].name)}
    return categories
  },
  categoriesMinusOne: state => (catId) => {
    let categories = [' ']
    for(let i=0;i < state.categoriesAndProducts.length;i++) {
      if (state.categoriesAndProducts[i].productCategoryId != catId)
        categories.push(state.categoriesAndProducts[i].name)}
    return categories
  },
  areas: state => {
    let areas = []
    for(let i=1;i<= state.areasAndSpots.length;i++) {
        areas.push(i + '-' + state.areasAndSpots[i-1].description)}
    return areas
  },
  areaById: (state) => (id) => {
      for (let record = 0; record < state.areasAndSpots.length;record++) {
        if (state.areasAndSpots[record].accommodationAreaId == id) {
          return state.areasAndSpots[record]}}
  },
  areaByDesc: (state) => (desc) => {
      for (let record = 0; record < state.areasAndSpots.length;record++) {
        if ((record+1) + '-' + state.areasAndSpots[record].description === desc) {
          return state.areasAndSpots[record]}}
  },
  areasAndSpots: state => {
      return state.areasAndSpots
  },
  areasAndSpotCount: state => {
    let areas = []
    for (let i = 0; i < state.areasAndSpots.length;i++) {
      areas.push({accommodationAreaId: state.areasAndSpots[i].accommodationAreaId,
                  description: state.areasAndSpots[i].description,
                  image: state.areasAndSpots[i].image,
                  nbrOfSpots: state.areasAndSpots[i].spots.length})}
    return areas
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
  prepAreasAndCategories: state => id =>{
    if (id) return state.prepAreasAndCategories.find(o => o.preparationAreaId === id)
    else return state.prepAreasAndCategories
  },
  prepAreasAndCatgCount: state => {
    let areas = []
    for (let i = 0; i < state.prepAreasAndCategories.length;i++) {
      areas.push({preparationAreaId: state.prepAreasAndCategories[i].preparationAreaId,
                  description: state.prepAreasAndCategories[i].description,
                  image: state.prepAreasAndCategories[i].image,
                  nbrOfCatg: state.prepAreasAndCategories[i].categories.length})}
    return areas
  },
  prepAreas: state => (blank=true) => {
    let areas = []
    if (blank) areas.push(' ')
    for (let i = 0; i < state.prepAreasAndCategories.length;i++) {
      areas.push(state.prepAreasAndCategories[i].description)}
    return areas
  },
  prepAreasByDesc: state => desc => {
    return state.prepAreasAndCategories.find(o => o.description === desc)
  },
  products: state => {
    return state.products
  },
  productsByCatg: state => catgId => {
    return state.products.filter(o => o.productCategoryId === catgId)
  },
  user: state => { return state.user },
  users: state => {
    return state.users
  },
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
  company: state => {
      return state.company
  },
  apiKey: state => {
      return state.apiKey
  },
  moquiToken: state => {
      return state.moquiToken
  }
}
// export this module.
export default {
  state,
  mutations,
  getters
}
