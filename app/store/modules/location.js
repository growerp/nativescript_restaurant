import store from '~/store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
var log = true
if (TNS_ENV === 'production') log = false
const state = {
  accommodationAreas: [{
    accommodationAreaId: '',
    description: '',
    image: '',
    nbrOfSpots: '',
    printerHostUrl: '',
    printerName: ''
  }],
  accommodationSpots: [{
    accommodationSpotId: '',
    spotNumber: '',
    nbrOfSeats: '',
    accommodationAreaId: '',
    description: '',
    ordered: Boolean
  }],
  preparationAreas: [{
    preparationAreaId: '',
    description: '',
    image: '',
    nbrOfCatg: ''
  }],
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
        if (log) console.log("===Acommodation area not found:" + value.accommodationAreaId) }
      else if (verb == 'update') {
          state.accommodationSpots.splice(index,1,value) }
      else if (verb == 'delete') {
        updateAccommodationSpotCount(value.accommodationAreaId, false)
        state.accommodationSpots.splice(index,1)
      }        
    }
    if(log) console.log("=====accommodationspot action: " + verb + 
        ' completed spot: ' + value.spotNumber)
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
}
const actions = {
  async createAccommodationArea({ commit }, item) {
    let result = await backendService.createAccommodationArea(item)
    item.verb= 'add'
    item.image= global.noImage,
    item.accommodationAreaId = result.data.accommodationAreaId
    item.accommodationSpots = result.data.accommodationSpots
    commit('accommodationArea', item)
  },
  updateAccommodationArea({ commit }, item) {
    backendService.updateAccommodationArea(item)
    item.verb = 'update'
    commit('accommodationArea', item)
  },
  deleteAccommodationArea({ commit }, id) {
    backendService.deleteAccommodationArea(id)
    commit('accommodationArea', {
      verb: 'delete', accommodationAreaId: id})
  },
  async createAccommodationSpot({commit}, item) {
    await backendService.createAccommodationSpot(
        item.accommodationAreaId, item.spotNumber)
    .then( result => {
      item.accommodationSpotId = result.data.accommodationSpotId
      item.verb = "add",
      commit('accommodationSpot',item)
    })
  },
  deleteAccommodationSpot({ commit }, item) {
    backendService.deleteAccommodationSpot(item.spotId)
    commit('accommodationSpot', {
      verb: 'delete',
      accommodationSpotId: item.spotId,
      accommodationAreaId: item.areaId})
  },
  async createPreparationArea({commit}, item) {
    let result = await backendService.createPreparationArea(item)
    item.verb = 'add'
    item.nbrOfCatg = 0
    item.image = global.noImage
    item.preparationAreaId = result.data.preparationAreaId
    commit('preparationArea', item)
  },
  updatePreparationArea({ commit }, item) {
    backendService.updatePreparationArea(item)
    item.verb = 'update'
    commit('preparationArea', item)
  },
  deletePreparationArea({ commit }, id) {
    backendService.deletePreparationArea(id)
    .then(() => {
      commit('preparationArea', {
          verb: 'delete', preparationAreaId: id})
    })
  },
}
const getters = {
  // accomodation related area/spot related===================================
  accommodationAreas: state => {
    return state.accommodationAreas
  },
  accommodationAreaByDesc: state => desc => {
    return state.accommodationAreas.find(o => o.description === desc)
  },
  accommodationAreaById: state => id => {
    let result = state.accommodationAreas.find(o => o.accommodationAreaId === id)
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
  accommodationSpotByItem: state => item =>{
    return state.accommodationSpots.find(
      o => (o.accommodationSpotId === item.accommodationSpotId &&
           o.accommodationAreaId === item.accommodationAreaId) 
      )
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
  preparationAreaIdByProductId: state => productId => {
    let productCategoryId = 
        store.getters.productById(productId).productCategoryId
    return store.getters.productCategoryById(
        productCategoryId).preparationAreaId
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
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
