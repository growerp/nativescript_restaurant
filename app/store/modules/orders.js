import store from '..'
const log = true 
const state = {
  openOrders: [{
    orderId: '',
    preparationAreaId: '',
    orderPartSeqId: '',
    prepDescription: '',
    customerPartyId: '',
    accommodationAreaId: '',
    description: '',
    accommodationSpotId: '',
    spotNumber: '',
    nbrOfGuests: '',
    totalQuantity: '',
    totalAmount: '',
    image: '',
    nbrOfItems: '',
    items: [{
      orderItemSeqId: '',
      productId: '',
      itemDescription: '',
      price: '',
      quantity: '',
      image: ''
    }]
  }],
  ordersAndItemsByPrepAreas: [] //layout same as openorders
}

const mutations = {
  openOrders(state, value) {
    state.openOrders = value 
  },
  ordersAndItemsByPrepAreas(state, value) {
    state.ordersAndItemsByPrepAreas = value
  },
  ordersAndItemsByPrepArea(state,value) { // need orderId and prepId
    let index = state.ordersAndItemsByPrepAreas.findIndex(
      o => o.preparationAreaId === value.preparationAreaId &&
      o.orderId === value.orderId)
    state.ordersAndItemsByPrepAreas.splice(index,1)
  }
}
const getters = {
  preparationAreaOrdersById: state => id => {
    return state.ordersAndItemsByPrepAreas.filter(
      o => o.preparationAreaId === id && o.partStatusId === 'OrderOpen')
  },
  preparationAreaHasOrders: state => id => {
    return state.ordersAndItemsByPrepAreas.filter(
      o => o.preparationAreaId === id && o.partStatusId === 'OrderOpen').length 
  },
  serveOrders: state => {
      state.ordersAndItemsByPrepAreas.filter(
      o => o.partStatusId === 'OrderPlaced')
      return state.ordersAndItemsByPrepAreas.filter(
        o => o.partStatusId === 'OrderPlaced')
    },
  serveHasOrders: state => {
    return state.ordersAndItemsByPrepAreas.filter(
      o => o.partStatusId === 'orderPlaced').length
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
}
const actions = {
  
}
export default {
  state,
  mutations,
  getters,
  actions
}
