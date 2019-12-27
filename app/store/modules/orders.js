import store from '~/store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
var log = true
//if (TNS_ENV === 'production') log = false

const state = {
   // all open orders with all items in list together in a single order line
  openOrders: [{
    orderId: '',
    orderStatusId: '',
    placedDateTimestamp: '',
    placedDate: '',
    placedTime: '',
    partyId: '',
    firstName: '',
    lastName: '',
    statusId: '',
    nbrOfGuests: '',
    grandTotal: '',
    table: '',
    accommodationAreaId: '',
    accommodationSpotId: '',
    spotNumber: '',
    nbrOfItems: '',
    items: [{
      productId: '',
      image: '',
      orderItemSeqId: '',
      description: '',
      quantity: '',
      price: '',
      totalAmount: '',
    }]
  }],
  //all open orders with status open(prepare), placed(serve)
  //orders have items split by preparation area
  ordersAndItemsByPrepAreas: [{ 
    orderId: '',
    preparationAreaId: '',
    orderPartSeqId: '',
    partStatusId: '',
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
      image: '',
      description: '',
      quantity: '',
      price: '',
      totalAmount: '',
    }]
  }] 
}
const mutations = {
  changeOrderStatus(state, value) {
    log?console.log("=====update order status in store: " + JSON.stringify(value)):''
    state.ordersAndItemsByPrepAreas.forEach( (order, prepIndex) => {
      if (order.orderId == value.orderId)
        state.ordersAndItemsByPrepAreas.splice(prepIndex,1)
    })
    let index = state.openOrders.findIndex(o => o.orderId == value.orderId)
    let item = state.openOrders[index]
    item.orderStatusId = value.statusId
    state.openOrders.splice(index,1,item)
  },
  openOrders(state, value) {
    state.openOrders = value
    if (state.openOrders.length > 1)
      state.openOrders.sort(function (a, b) {
        return a.placedDateTimestamp - b.placedDateTimestamp})
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
    return getters.preparationAreaOrdersById(id).length 
  },
  prepOrdersByStatusId: state => id => { //OrderPlaced = serv,OrderApproved = bill 
    return state.ordersAndItemsByPrepAreas.filter(
        o => o.partStatusId === id)
    },
  ordersByStatusId: state => id => {
    return state.openOrders.filter(
          o => o.orderStatusId === id)
  },
  openOrders: state => {
    return state.openOrders
  },
  openOrderById: state => id => {
    return state.openOrders.find( o => o.orderId === id)
  },
  ordersAndItemsByPrepAreas: state => {
    return state.ordersAndItemsByPrepAreas
  },
  openOrdersByAreaSpotId: state => (spotId) => {
    return state.openOrders.filter(
      o => o.accommodationSpotId === spotId &&
      o.orderStatusId !== 'OrderCompleted' &&
      o.orderStatusId !== 'OrderCancelled' )
  },
}
const actions = {
  changeOrderStatus({commit}, item) {
    // clear spot un-occupied
    if (item.orderStatusId === 'OrderCancelled' || item.orderStatusId === 'OrderCompleted') {
      let order = Object.assign({},store.getters.openOrderById(item.orderId))
      if (store.getters.openOrdersByAreaSpotId(order.accommodationSpotId).length < 2) {
        let spot = Object.assign({},
          store.getters.accommodationSpotById(order.accommodationSpotId))
        spot.verb = 'update'
        spot.ordered = false
        store.commit('accommodationSpot', spot)
      }
    }
    backendService.changeOrderPartStatus(
      item.orderId, null, item.orderStatusId)
    commit('changeOrderStatus',{
      orderId: item.orderId, 
      statusId: item.orderStatusId})
  }, 
  async createSalesOrder({dispatch}, item) {
    // set spot to ordered
    let spot = Object.assign({}, 
        store.getters.accommodationSpotById(item.header.accommodationSpotId))
    spot.verb = 'update'
    spot.ordered = true
    store.commit('accommodationSpot', spot)
    // remove pictures
    for (let i=0; i<item.items.length;i++) delete item.items[i].image
    let result = await backendService.createSalesOrder(item.header, item.items)
    await dispatch('getOrders')
    return result
  },
  async getOpenOrders({commit}) {
    let result = await backendService.getOrders() // default is open only
    commit("openOrders", result.data.ordersAndItems)
  },
  async getOrders({dispatch}) {
    await dispatch('getOpenOrders')
    await dispatch('getOrdersAndItemsByPrepAreas')
  },
  async getOrdersAndItemsByPrepAreas({commit}) {
    let result = await backendService.getOrdersAndItemsByPrepAreas() 
    commit('ordersAndItemsByPrepAreas', result.data.ordersAndItemsByPrepAreas)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
