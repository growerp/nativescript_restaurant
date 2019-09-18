const log = true 
const state = {
  preparationAreas: [],
  accommodationAreas: [],
  accommodationSpots: [],
  productCategories: [],
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
  accommodationSpot(state, value) { // update
    console.log("=====incoming value: " + JSON.stringify(value))
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
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
    state.productCategories = value
  },
  productCategory(state, value) {
    console.log("====incoming category" + JSON.stringify(value))
    let verb = value.verb; delete value.verb
    if (verb == 'add') {
      let i = 0
      for (i=0; i<state.productCategories.length;i++) 
        if (value.name.toLowerCase() < 
          state.productCategories[i].name.toLowerCase()) break;
      state.productCategories.splice(i,0,value)
    } else {
      let index = state.productCategories.findIndex(
        o => o.productCategoryId === value.productCategoryId)
      if (index == -1) console.log("productCategory not found:" + value.productCategoryId)
      else {
        if (verb == 'delete')
          state.productCategories.splice(index,1)
        if (verb == 'update') {
          console.log("====update value: " + JSON.stringify(value))
          // update count in preparation areas if required
          if (state.productCategories[index].preparationArea != value.preparationAreaId) {
            let prepIndex = state.preparationAreas.findIndex( 
              o => o.preparationAreaId === state.productCategories[index].preparationAreaId)
            let preparationArea = state.preparationAreas[prepIndex]
            preparationArea.nbrOfCatg--
            state.preparationAreas.splice(prepIndex,1,preparationArea)
            prepIndex = state.preparationAreas.findIndex( 
              o => o.preparationAreaId === value.preparationAreaId)
            preparationArea = state.preparationAreas[prepIndex]
            preparationArea.nbrOfCatg++
            state.preparationAreas.splice(prepIndex,1,preparationArea)
          }
          state.productCategories.splice(index,1,value)
        }
      }
    }
  },
}
const getters = {
  accommodationAreas: state => {
    return state.accommodationAreas
  },
  accommodationSpots: state => {
    return state.accommodationSpots
  },
  accommodationSpotsByAreaId: state => id => {
    return state.accommodationSpots.filter(o => o.accommodationAreaId === id)
  },
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
  productCategories: state => {
    return state.productCategories
  },
  productCategoryById: state => id => {
    return state.productCategories.find(o => o.productCategoryId === id)
  },
  productCategoriesByPrepId: state => prepId => {
    return state.productCategories.filter(o => o.preparationAreaId === prepId)
  }
}
// export this module.
export default {
  state,
  mutations,
  getters
}
