import store from '~/store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
var log = true
if (TNS_ENV === 'production') log = false
const state = {
  productCategories: [{
    productCategoryId: '',
    categoryName: '',
    preparationAreaId: '',
    description: '',
    image: '',
    nbrOfProducts: ''
  }],
  products: [{
    productId: '',
    name: '',
    price: '',
    productCategoryId: '',
    categoryName: '',
    image: '',
  }]
}

const mutations = {
  //=========== productcategory
  productCategories(state, value) {
    state.productCategories = value
  },
  productCategory(state, value) {
    if (log) console.log("====CatProd incoming productCategory action: " + value.verb + " data: " +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i; i<state.productCategories.length;i++) // insert in order
        if (value.categoryName.toLowerCase() < 
                  state.productCategories[i].categoryName.toLowerCase())
          break;
      updatePreparationCategoryCount(value.preparationAreaId, true)
      state.productCategories.splice(i,0,value)
    } else {
      let index = state.productCategories.findIndex(
        o => o.productCategoryId === value.productCategoryId)
      if (index == -1)
        log? console.log("productCategoryId not found:" + value.productCategoryId):''
      else if (verb == 'delete') {
        updatePreparationCategoryCount(
          state.productCategories[index].preparationAreaId, false)
          state.productCategories.splice(index,1)}
      else if (verb == 'update') {
        // update count in preparation areas if required
        if (state.productCategories[index].preparationAreaId !== 
              value.preparationAreaId) {
          log? console.log("====prepid changed!"):''
          updatePreparationCategoryCount(
              state.productCategories[index].preparationAreaId, false)
          updatePreparationCategoryCount(value.preparationAreaId, true)
        }
        state.productCategories.splice(index,1,value)
      }
    }
    if(log) console.log("===store==category update completed, action: " + 
            verb + " name:" + value.categoryName)
    // update count in the preparation area list
    function updatePreparationCategoryCount( id, increment) {
      let prepArea = store.getters.preparationAreaById(id)
      if (increment) prepArea.nbrOfCatg++
      else prepArea.nbrOfCatg--
      prepArea.verb = 'update'
      store.commit('preparationArea', prepArea)
    }
  },
  //=========== product
  product(state, value) {
    if (log) console.log("====locCatProd incoming product update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.products.length;i++)
        if (value.name.toLowerCase() < state.products[i].name.toLowerCase())
          break;
      updateCategoryProductCount(value.productCategoryId, true)
      state.products.splice(i,0,value)
    } else {
      let index = state.products.findIndex(
        o => o.productId === value.productId)
      if (index == -1) {
        if (log) console.log("product not found:" + value.productId) }
      else if (verb == 'delete') {
          updateCategoryProductCount(state.products[index].productCategoryId, false)
          state.products.splice(index,1)
      } else if (verb == 'update') {
        if (state.products[index].productCategoryId != value.productCategoryId) {
          if (log) console.log("==== productCategory change for product: " + value.name)
          updateCategoryProductCount(
              state.products[index].productCategoryId, false)
          updateCategoryProductCount(value.productCategoryId, true)
        }
        state.products.splice(index,1,value)
      }
    }
    // update count in the productCategory list
    function updateCategoryProductCount( id, increment) {
      if (log) console.log("==== update count in productCategory list")
      let catIndex = state.productCategories.findIndex(
        o => o.productCategoryId === id)
      let productCategory = state.productCategories[catIndex]
      if (increment) productCategory.nbrOfProducts++
      else productCategory.nbrOfProducts--
      state.productCategories.splice(catIndex,1,productCategory)
    }
  },
  products(state, value) {
    state.products = value
  },
}
const actions = {
  async createProductCategory({ commit }, item) {
    let result = await backendService.createCategory(item)
    item.verb = 'add'
    item.image = global.noImage
    item.nbrOfProducts = '0'
    item.productCategoryId = result.data.productCategoryId
    commit('productCategory', item)
  },
  updateProductCategory({ commit }, item) {
    backendService.updateCategory(item)
    item.verb = 'update'
    commit('productCategory', item)
  },
  deleteProductCategory({ commit }, id) {
    backendService.deleteCategory(id)
    commit('productCategory', {
      verb: 'delete', 
      productCategoryId: id })
  }
}
const getters = {
  // productCategory related===================================================
  productCategories: state => {
    return state.productCategories
  },
  productCategoriesAndProducts: state => {
  let catAndProd = state.productCategories
  for (let i=0;i<catAndProd.length; i++)
    catAndProd[i].products = store.getters.productsByCatg(
      catAndProd[i].productCategoryId)
  return catAndProd
  },
  productCategoryByDesc: state => desc => {
    let result = state.productCategories.find(o => o.categoryName === desc)
    return typeof(result) != "undefined" ? result : -1
  },
  productCategoryById: state => id => {
    let result = state.productCategories.find(o => o.productCategoryId === id)
    return typeof(result) != "undefined" ? result : -1
  },
  productCategoriesByPrepId: state => prepId => {
    return state.productCategories.filter(o => o.preparationAreaId === prepId)
  },
  productCategoriesDesc: state => (blank=true) => {
    let categories = []
    if (blank) categories.push(' ')
    for(let i=0;i<state.productCategories.length;i++)
        categories.push(state.productCategories[i].categoryName)
    return categories
  },
  productCategoriesMinusOne: state => catId => {
    let prodCats = []
    for(let i=0;i<state.productCategories.length;i++)
      if (state.productCategories[i].productCategoryId != catId)
        prodCats.push(state.productCategories[i])
    return prodCats
  },
  // product related==========================================================
  products: state => {
    return state.products
  },
  productsByCatg: state => catgId => {
    return state.products.filter(o => o.productCategoryId === catgId)
  },
  productById: state => id => {
    return state.products.find(o => o.productId === id)
  },
  productsSearchName: state => name => {
    return state.products.filter(
        o => o.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
  }
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
