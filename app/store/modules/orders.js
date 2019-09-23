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
}

const mutations = {
  openOrders(state, value) {
    state.openOrders = value 
  },
}
const getters = {
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
// export this module.
export default {
  state,
  mutations,
  getters
}
