const log = true 
const state = {
  preparationAreas: [],
  accommodationAreas: [],
  accommodationSpots: [],
  productCategories: [],
  products: []
}
const appSettings = require("tns-core-modules/application-settings")

const mutations = {
  // accommodationArea and Spots
  accommodationArea(state, value) { // update
    console.log("====store incoming:" + JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i=0; i<state.accommodationAreas.length;i++) 
        if (value.description.toLowerCase() < 
          state.accommodationAreas[i].description.toLowerCase()) break;
      state.accommodationAreas.splice(i,0,value)
      if (value.accommodationSpots) { //update spots
        state.accommodationSpots = 
            state.accommodationSpots.concat(value.accommodationSpots)
        state.accommodationSpots.sort(function (a, b) {
          return parseInt(a.spotNumber,10) - parseInt(b.spotNumber,10)})
      }
    } else {
      let index = state.accommodationAreas.findIndex(
        o => o.accommodationAreaId === value.accommodationAreaId)
      if (index == -1) console.log("accommodation area not found:" + value.description)
      else {
        if (verb == 'delete')
          state.accommodationAreas.splice(index,1)
        if (verb == 'update')
          state.accommodationAreas.splice(index,1,value)
      }
    }
  },
  accommodationAreas(state, value) {
    if (value.length > 1) 
      value.sort(function (a, b) {
        return a.description.toLowerCase().localeCompare(b.description.toLowerCase())})
    state.accommodationAreas = value 
  },
  accommodationSpot(state, value) {
    console.log("=====incoming value accomspot: " + JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i=0; i<state.accommodationSpots.length;i++) 
        if (parseInt(value.spotNumber,10) <
            parseInt(state.accommodationSpots[i].spotNumber,10)) break;
      state.accommodationSpots.splice(i,0,value)
      console.log("=====valuee added: " + state.accommodationSpots[i].spotNumber )
    } else {
      let index = state.accommodationSpots.findIndex(
        o => o.accommodationSpotId === value.accommodationSpotId)
      if (index == -1) console.log("accommodation spot not found:" + value.spotNumber)
      else {
        if (verb == 'delete')
          state.accommodationSpots.splice(index,1)
      }
    }
  },
  accommodationSpots(state, value) {
    value.sort(function (a, b) {
      return parseInt(a.spotNumber,10) - parseInt(b.spotNumber,10)})
    state.accommodationSpots = value 
  },
  // ============PreparationArea 
  preparationArea(state, value) {
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i=0; i<state.preparationAreas.length;i++) 
        if (value.description.toLowerCase() <
           state.preparationAreas[i].description.toLowerCase()) break;
      state.preparationAreas.splice(i,0,value);
    } else {
      let index = state.preparationAreas.findIndex(
        o => o.preparationAreaId === value.preparationAreaId)
      if (index == -1) console.log("preparation area not found:" + value.preparationAreaId)
      else {
        if (verb == 'delete')
          state.preparationAreas.splice(index,1)
        if (verb == 'update')
          state.preparationAreas.splice(index,1,value)
      }
    }
  },
  preparationAreas(state, value) {
    if (value.length > 1) 
      value.sort(function (a, b) {
        return a.description.toLowerCase().localeCompare(b.description.toLowerCase())})
      state.preparationAreas = value;
  },
  //=========== productcategory
  productCategories(state, value) {
    if (value.length > 1) 
      value.sort(function (a, b) {
        return a.categoryName.toLowerCase().localeCompare(b.categoryName.toLowerCase())})
    state.productCategories = value
  },
  productCategory(state, value) {
    console.log("====locCatProd incoming category update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb == 'add') {
      console.log("=====verb = add!!!!")
      let i = 0
      for (i=0; i<state.productCategories.length;i++) {
        if (value.categoryName.toLowerCase() < state.productCategories[i].categoryName.toLowerCase()) 
          break;
      }
      updatePreparationCategoryCount(value.preparationAreaId, true)
      state.productCategories.splice(i,0,value)
    } else {
      let index = state.productCategories.findIndex(
        o => o.productCategoryId === value.productCategoryId)
      if (index == -1)
        console.log("productCategory not found:" + value.productCategoryId)
      else {
        if (verb == 'delete')
          console.log("=====verb = delete!!!")
          updatePreparationCategoryCount(
            state.productCategories[index].preparationAreaId, false)
          state.productCategories.splice(index,1)
            if (verb == 'update') {
          console.log("====update value: " + JSON.stringify(value))
          // update count in preparation areas if required
          if (state.productCategories[index].preparationArea != 
                value.preparationAreaId) {
            updatePreparationCategoryCount(
                state.productCategories[index].preparationAreaId, false)
            updatePreparationCategoryCount(value.preparationAreaId, true)
          }
          state.productCategories.splice(index,1,value)
        }
      }
    }
    // update count in the preparation area list
    function updatePreparationCategoryCount( id, increment) {
      console.log("========update prep!!!!! with increment: " + increment)
      let prepIndex = state.preparationAreas.findIndex(
        o => o.preparationAreaId === id)
      let preparationArea = state.preparationAreas[prepIndex]
      console.log("=======updating preparation area " + preparationArea.description)
      if (increment) preparationArea.nbrOfCatg++
      else preparationArea.nbrOfCatg--
      state.preparationAreas.splice(prepIndex,1,preparationArea)
    }
  },
  //=========== product
  product(state, value) {
    console.log("====locCatProd incoming product update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb == 'add') {
      console.log("=====verb = add!!!!")
      let i = 0
      for (i=0; i<state.products.length;i++) {
        if (value.name.toLowerCase() < state.products[i].name.toLowerCase()) 
          break;
      }
      updateCategoryProductCount(value.productCategoryId, true)
      state.products.splice(i,0,value)
    } else {
      let index = state.products.findIndex(
        o => o.productId === value.productId)
      if (index == -1)
        console.log("product not found:" + value.productId)
      else {
        if (verb == 'delete')
          console.log("=====verb = delete!!!")
          updateCategoryProductCount(state.products[index].productCategoryId, false)
          state.products.splice(index,1)
            if (verb == 'update') {
          console.log("====update value: " + JSON.stringify(value))
          if (state.products[index].productCategoryId != value.productCategoryId) {
            updateCategoryProductCount(
                state.products[index].productCategoryId, false)
            updateCategoryProductCount(value.productCategoryId, true)
          }
          state.products.splice(index,1,value)
        }
      }
    }
    // update count in the productCategory list
    function updateCategoryProductCount( id, increment) {
      console.log("========update cat!!!!! with increment: " + increment)
      let catIndex = state.productCategories.findIndex(
        o => o.productCategoryId === id)
      let productCategory = state.productCategories[catIndex]
      console.log("=======updating category " + productCategory.categoryName)
      if (increment) productCategory.nbrOfProd++
      else productCategory.nbrOfProd--
      state.productCategories.splice(catIndex,1,productCategory)
    }
  },
  products(state, value) {
    if (value.length > 1) 
      value.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
    state.products = value
  },
}
const getters = {
  // accomodation related area related==========================================================
  accommodationAreas: state => {
    return state.accommodationAreas
  },
  accommodationSpots: state => {
    return state.accommodationSpots
  },
  accommodationSpotsByAreaId: state => id => {
    return state.accommodationSpots.filter(o => o.accommodationAreaId === id)
  },
  // preparation area related==========================================================
  preparationAreas: state => {
    return state.preparationAreas
  },
  preparationAreaByDesc: state => desc => {
    return state.preparationAreas.find(o => o.description === desc)
  },
  preparationAreasDescMinusOne: state => prepId => {
    let prepAreas = [" "]
    for(let i=0;i<state.preparationAreas.length;i++)
      if (state.preparationAreas[i].preparationAreaId != prepId)
        prepAreas.push(state.preparationAreas[i].description)
    return prepAreas
  },
  preparationAreasDesc: state => (blank=true) => {
    let prepAreas = []
    if (blank) prepAreas.push(' ')
    for(let i=0;i<state.preparationAreas.length;i++)
        prepAreas.push(state.preparationAreas[i].description)
    return prepAreas
  },
  // productCategory related==========================================================
  productCategories: state => {
    return state.productCategories
  },
  productCategoryByDesc: state => desc => {
    return state.productCategories.find(o => o.categoryName === desc)
  },
  productCategoryById: state => id => {
    return state.productCategories.find(o => o.productCategoryId === id)
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
  // product related==========================================================
  products: state => {
    return state.products
  },
  productsByCatg: state => catgId => {
    return state.products.filter(o => o.productCategoryId === catgId)
  }
}
// export this module.
export default {
  state,
  mutations,
  getters
}
