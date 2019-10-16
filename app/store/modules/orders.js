import BackendService from "~/services/backend-service"
const backendService = new BackendService()
const log = true 

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
  changeOrderPartStatus(state, value) {
    log?console.log("=====update part status in store: " + JSON.stringify(value)):''
    let index = state.openOrders.findIndex(o => o.orderId == value.orderId)
    console.log("====finding index order: " + index, "==id: " + value.orderId)
    let item = state.openOrders[index]
    let prepItem = null;let prepIndex = null
    if (value.partId) {
      prepIndex = state.ordersAndItemsByPrepAreas.findIndex( 
        o => o.orderId == value.orderId && o.orderPartSeqId == value.partId)
      console.log("====finding index prep: " + prepIndex, "==id: " + value.partId)
      prepItem = state.ordersAndItemsByPrepAreas[prepIndex]}
    if (value.statusId == 'serv') {
      prepItem.partStatusId = 'OrderPlaced'
      state.ordersAndItemsByPrepAreas.splice(prepIndex,0,prepItem)
      item.orderStatusId = 'OrderPlaced'
      state.openOrders.splice(index,1,item)
    } else if (value.statusId == 'bill') { // remove from prep list -> billed
      state.ordersAndItemsByPrepAreas.splice(prepIndex,1)
      prepIndex = state.ordersAndItemsByPrepAreas.findIndex( // any left? 
            o => o.orderId == value.orderId)
      if (index == -1) { // no, so we can bill: change status in openOrders
        item.orderStatusId = 'OrderPlaced'
        state.openOrders.splice(index,1,item)}
    } else if (value.statusId == 'completed') { // change open orders
      item.orderStatusId = 'OrderCompleted'
      state.openOrders.splice(index,1,item)}
    console.log("===status update completed")
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
    return state.ordersAndItemsByPrepAreas.filter(
        o => o.preparationAreaId === id && o.partStatusId === 'OrderOpen').length 
  },
  prepOrdersByStatusId: state => id => {
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
  changeOrderPartStatus({commit}, item) {
    backendService.changeOrderPartStatus(
      item.orderId, item.partId, item.statusId)
    commit('changeOrderPartStatus',{
      orderId: item.orderId, 
      partId: item.partId,
      statusId: item.statusId})
  }, 
  async createSalesOrder({dispatch}, item) {
    let result = await backendService.createSalesOrder(
          item.header, item.items)
    dispatch('getOrdersAndItemsByPrepAreas')
    dispatch('getOpenOrders')
    return result
  },
  async getOrdersAndItemsByPrepAreas({commit}) {
    let result = await backendService.GetOrdersAndItemsByPrepAreas()
    commit("ordersAndItemsByPrepAreas", result.data.ordersAndItemsByPrepAreas)
  },
  async getOpenOrders({commit}) {
    let result = await backendService.getOrders(state) // default is open only
    commit("openOrders", result.data.ordersAndItems)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
