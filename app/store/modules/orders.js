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
  changeOrderPartStatus(state, value) {
    log?console.log("=====update part status in store: " + JSON.stringify(value)):''
    let index = state.openOrders.findIndex(o => o.orderId == value.orderId)
    let item = state.openOrders[index]
    if (value.partId) { // order separated by preparea => update prepOrders
      let prepIndex = state.ordersAndItemsByPrepAreas.findIndex( 
        o => o.orderId == value.orderId && o.orderPartSeqId == value.partId)
      let prepItem = state.ordersAndItemsByPrepAreas[prepIndex]
      if (value.statusId == 'serv') {
        prepItem.partStatusId = 'OrderPlaced'
        state.ordersAndItemsByPrepAreas.splice(prepIndex,1,prepItem)
        item.orderStatusId = 'OrderPlaced'
        state.openOrders.splice(index,1,item)
      } else if (value.statusId == 'bill') { // remove from prep list -> billed
        state.ordersAndItemsByPrepAreas.splice(prepIndex,1)
        let left = state.ordersAndItemsByPrepAreas.filter( // any left? 
              o => o.orderId == value.orderId)
        if (left.length == 0) { // no, so we can bill: change status in openOrders
          item.orderStatusId = 'OrderApproved'
          state.openOrders.splice(index,1,item)}
      }
    } else if (value.statusId == 'completed') { // change open orders
      item.orderStatusId = 'OrderCompleted'
      state.openOrders.splice(index,1,item)}
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
  ordersAndItemsByPrepAreas: state => {
    console.log("===store return prep orders: " + state.ordersAndItemsByPrepAreas.length)
    return state.ordersAndItemsByPrepAreas
  },
  openOrdersByAreaSpot: state => (areaId, spotId) => {
    return state.openOrders.filter(
      o => o.accommodationAreaId === areaId &&
           o.accommodationSpotId === spotId &&
           o.orderStatusId !== 'Completed')
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
    // remove pictures
    for (let i=0; i<item.items.length;i++)
      delete item.items[i].image
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
