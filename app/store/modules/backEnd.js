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
  categoriesAndProducts: [],
  areasAndSpots:[],
  products: [],
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
    if (state.products.length > 1) state.products.sort(function (a, b) {
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
    if (!value.products) value.products = []
    if (value.products.length && value.products[0].productId) { // update the products file
      if (log) console.log("=====update products file...")
      let prodFileIndex = state.products.findIndex(
          o => o.productId === value.products[0].productId)
      let product = {}
      if (prodFileIndex != -1) {
        if (log) console.log("====products file: product found:" + 
            state.products[prodFileIndex].name)
        if (value.oldProductCategoryId && !value.productCategoryId) {
          if (log) console.log("===products file: product delete: " +  
              state.products[prodFileIndex].name)
          state.products.splice(prodFileIndex,1)// delete
        } else { // update
          product.productCategoryId = value.productCategoryId
          product.categoryName = state.categoriesAndProducts.find(
              o => o.productCategoryId === value.productCategoryId).name
          product.name = value.products[0].name?
              value.products[0].name : state.products[prodFileIndex].name
          product.price = value.products[0].price? 
              value.products[0].price : state.products[prodFileIndex].price
          product.image = value.products[0].image?
              value.products[0].image : state.products[prodFileIndex].image
          if (log) console.log("===products file: product update: " + product.name)
          state.products.splice(prodFileIndex,1, product) // update
        }
      } else { //add
        if (log) console.log("===products file: add product: " + value.products[0].name)
        state.products.push( {
          productId: value.products[0].productId,
          name: value.products[0].name,
          price: value.products[0].price,
          image: value.products[0].image,
          productCategoryId: value.productCategoryId,
          categoryName: value.name,
        })
      }
      if (log) console.log('====products file: sorting products file')
      if(state.products.length > 1) state.products.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      });
      if (log) console.log("====products file: done!p")
    }
    if (log) console.log("===updating categoriesAndProducts")
    let catIndex = -1;let prodIndex = -1; let category = {}
    // deleting category or product
    if (value.oldProductCategoryId && !value.productCategory) { //remove oldCategory without products
      catIndex = state.categoriesAndProducts.findIndex(
        o => o.productCategoryId === value.oldProductCategoryId)
      if (value.products.length) { //product
        prodIndex = state.categoriesAndProducts[catIndex].products.findIndex(
          o => o.productId === value.products[0].productId)
        if (log) console.log("====delete product: " + 
            state.categoriesAndProducts[catIndex].products[prodIndex].name)
      } else { // category
        if (log) console.log("====delete category: " + 
            state.categoriesAndProducts[catIndex].name)
        state.categoriesAndProducts.splice(catIndex,1)
      }
      if (log) console.log("====Remove cat/product done")
    }
    //move product from oldCategory to productCategory 
    if (value.oldProductCategoryId && value.productCategoryId && value.products.length) { 
      catIndex = state.categoriesAndProducts.findIndex(
          o => o.productCategoryId === value.oldProductCategoryId)
      prodIndex = state.categoriesAndProducts[catIndex].products.findIndex(
          o => o.productId === value.products[0].productId)
      if (prodIndex != -1) {            
        if (log) console.log("===remove product found and save data:" + 
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
    if (value.productCategoryId) { ///add/update/delete
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
        value.products = value.products.concat(
            state.categoriesAndProducts[catIndex].products)
        if (log) console.log('====after merging existing category products value: '
              + JSON.stringify(value))
        if (log) console.log('====products of cat to sort: ' + 
            JSON.stringify(value.products))
        if (value.products.length > 1) value.products.sort(function (a, b) { // sort products of category
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
        state.categoriesAndProducts.splice(catIndex,1,value) // update existing catg/product
      } else {
        if (log) console.log("====adding category:" + value.name)
        state.categoriesAndProducts.push(value) // new category
      }
      if (log) console.log('====cat to sort: ' + 
          JSON.stringify(state.categoriesAndProducts))
      if (state.categoriesAndProducts.length > 1) 
        state.categoriesAndProducts.sort(function (a, b) { // sort categories
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
    }
    if (log) console.log("====categoryAndProduct done!!!")
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
  products: state => {
    return state.products
  },
  productsByCatg: state => catgId => {
    return state.products.filter(o => o.productCategoryId === catgId)
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
