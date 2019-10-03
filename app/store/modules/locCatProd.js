import store from '../../store'
const log = true 
const state = {
  accommodationAreas: [{
    accommodationAreaId: '',
    description: '',
    image: '',
    nbrOfSpots: ''
  }],
  accommodationSpots: [{
    accommodationSpotId: '',
    spotNumber: '',
    nbrOfSeats: '',
    accommodationAreaId: '',
    description: ''
  }],
  preparationAreas: [{
    preparationAreaId: '',
    description: '',
    image: '',
    nbrOfCatg: ''
  }],
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
  // accommodationArea and Spots
  accommodationArea(state, value) { // update
    if (log) console.log("====locCatProd incoming accomodation Area update:" +
        JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i; i<state.accommodationAreas.length;i++) 
        if (value.description.toLowerCase() < 
              state.accommodationAreas[i].description.toLowerCase())
          break;
      if (value.accommodationSpots) { //update spots
        state.accommodationSpots = 
            state.accommodationSpots.concat(value.accommodationSpots)
        state.accommodationSpots.sort(function (a, b) {
          return parseInt(a.spotNumber,10) - parseInt(b.spotNumber,10)})
        delete value.accommodationSpots
        state.accommodationAreas.splice(i,0,value)
      }
    } else {
      let index = state.accommodationAreas.findIndex(
        o => o.accommodationAreaId === value.accommodationAreaId)
      if (index == -1) {
        if (log) console.log("accommodation area not found:" + value.description)}
      else if (verb == 'delete')
          state.accommodationAreas.splice(index,1)
      else  if (verb == 'update')
          state.accommodationAreas.splice(index,1,value)
    }
    if(log) console.log("=====accomodation area action: " + verb + 
      ' completed name: ' + value.name)
  },
  accommodationAreas(state, value) {
    if (value.length) 
    state.accommodationAreas = value 
  },
  accommodationSpot(state, value) { //update spot
    if (log) console.log("=====incoming value accomspot: " + JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0 // insert in sort order
      for (i; i<state.accommodationSpots.length;i++) 
        if (parseInt(value.spotNumber,10) <
             parseInt(state.accommodationSpots[i].spotNumber,10))
          break;
      updateAccommodationSpotCount(value.accommodationAreaId, true)
      state.accommodationSpots.splice(i,0,value)
    } else {
      let index = state.accommodationSpots.findIndex(
        o => o.accommodationSpotId === value.accommodationSpotId)
      if (index == -1) {
        if (log) console.log("===Acoomodation area not found:" + value.accommodationAreaId) }
      else if (verb == 'delete') {
        updateAccommodationSpotCount(value.accommodationAreaId, false)
        state.accommodationSpots.splice(index,1)
      }
    }
    if(log) console.log("=====accommodationspot action: " + verb + 
        ' completed name: ' + value.spotNumber)
    // update count in the preparation area list
    function updateAccommodationSpotCount( id, increment) {
      if (log) console.log("==== update count in accom list for accomm id: " + id)
      let accIndex = state.accommodationAreas.findIndex(
        o => o.accommodationAreaId === id)
      let accommodationArea = state.accommodationAreas[accIndex]
      if (increment) state.accommodationAreas[accIndex].nbrOfSpots++
      else state.accommodationAreas[accIndex].nbrOfSpots--
      console.log("spotnr updated: " + accommodationArea.nbrOfSpots)
      state.accommodationAreas.splice(accIndex,1,accommodationArea)
    }
  },
  accommodationSpots(state, value) {
    state.accommodationSpots = value 
  },
  // ============PreparationArea 
  preparationArea(state, value) {
    if (log) console.log("====locCatProd incoming preparationArea update:" +
        JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i; i<state.preparationAreas.length;i++) 
        if (value.description.toLowerCase() <
                state.preparationAreas[i].description.toLowerCase())
          break
      state.preparationAreas.splice(i,0,value);
    } else {
      let index = state.preparationAreas.findIndex(
        o => o.preparationAreaId === value.preparationAreaId)
      if (index == -1) {
        if (log) console.log("preparation area not found:" + value.preparationAreaId) }
      else if (verb == 'delete')
          state.preparationAreas.splice(index,1)
      else if (verb == 'update')
          state.preparationAreas.splice(index,1,value)
    }
    if(log) console.log("=====preparation area action: " + verb +
          ' completed name: ' + value.description)
  },
  preparationAreas(state, value) {
    state.preparationAreas = value
  },
  //=========== productcategory
  productCategories(state, value) {
    state.productCategories = value
  },
  productCategory(state, value) {
    if (log) console.log("====locCatProd incoming productCategory action: " + value.verb + " data: " +
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
      if (index == -1) {
        if (log) console.log("productCategoryId not found:" + value.productCategoryId)}
      else if (verb == 'delete') {          
        updatePreparationCategoryCount(
          state.productCategories[index].preparationAreaId, false)
        state.productCategories.splice(index,1)
      } else if (verb == 'update') {
        // update count in preparation areas if required
        if (state.productCategories[index].preparationAreaId !== 
              value.preparationAreaId) {
          if(log) console.log("====prepid changed!")
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
      let prepIndex = state.preparationAreas.findIndex(
        o => o.preparationAreaId === id)
      let preparationArea = state.preparationAreas[prepIndex]
      if (log) console.log("==== update count in preparea list for preparea: " + 
            preparationArea.description)
      if (increment) preparationArea.nbrOfCatg++
      else preparationArea.nbrOfCatg--
      state.preparationAreas.splice(prepIndex,1,preparationArea)
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
const getters = {
  // accomodation related area related=========================================
  accommodationAreas: state => {
    return state.accommodationAreas
  },
  accommodationAreaByDesc: state => desc => {
    return state.accommodationAreas.find(o => o.description === desc)
  },
  accommodationAreaById: state => id => {
    result = state.accommodationAreas.find(o => o.accommodationAreaId === id)
    return typeof(result) != "undefined" ? result : -1
  },
  accommodationAreasDesc: state => (blank=true) => {
    let areas = []
    if (blank) areas.push(' ')
    for(let i=0;i<state.accommodationAreas.length;i++)
        areas.push(state.accommodationAreas[i].description)
    return areas
  },
  accommodationSpots: state => {
    return state.accommodationSpots
  },
  accommodationSpotsByAreaId: state => id => {
    return state.accommodationSpots.filter(o => o.accommodationAreaId === id)
  },
  // preparation area related==================================================
  preparationAreas: state => {
    return state.preparationAreas
  },
  preparationAreaByDesc: state => desc => {
    return state.preparationAreas.find(o => o.description === desc)
  },
  preparationAreaById: state => id => {
    return state.preparationAreas.find(o => o.preparationAreaId === id)
  },
  preparationAreasMinusOne: state => prepId => {
    let prepAreas = []
    for(let i=0;i<state.preparationAreas.length;i++)
      if (state.preparationAreas[i].preparationAreaId != prepId)
        prepAreas.push(state.preparationAreas[i])
    return prepAreas
  },
  preparationAreasDesc: state => (blank=true) => {
    let prepAreas = []
    if (blank) prepAreas.push(' ')
    for(let i=0;i<state.preparationAreas.length;i++)
        prepAreas.push(state.preparationAreas[i].description)
    return prepAreas
  },
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
    result = state.productCategories.find(o => o.categoryName === desc)
    return typeof(result) != "undefined" ? result : -1
  },
  productCategoryById: state => id => {
    result = state.productCategories.find(o => o.productCategoryId === id)
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
}
// export this module.
export default {
  state,
  mutations,
  getters
}
