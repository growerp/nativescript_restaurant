import store from '~/store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
var log = true
//if (TNS_ENV === 'production') log = false

const state = {
  // all open orders with status open(prepare), 
  // placed(serve) approved(bill) completed(done)
  // orders have items split by preparation area(parts)
  ordersAndItemsByPrepAreas: [{ 
    orderId: '',
    statusId: '',
    spotId: '',
    placedDateTimestamp: '',
    placedDate: '',
    placedTime: '',
    partyId: '',
    name: '',
    nbrOfGuests: '',
    table: '',
    grandTotal: '',
    image: '',
    parts: [{
      preparationAreaId: '',
      prepDescription: '',
      orderPartSeqId: '',
      statusId: '',
      nbrOfItems: '',
      image: '',
      items: [{
        orderItemSeqId: '',
        productId: '',
        description: '',
        quantity: '',
        price: '',
        totalAmount: '',
        image: '',
      }]
    }]
  }] 
}
const mutations = {
  changeOrderStatus(state, value) {
    log?console.log("=====update order status in store: " + JSON.stringify(value)):''
    let orderIndex = state.ordersAndItemsByPrepAreas.
      findIndex(o => { o.orderId == value.orderId})
    if (value.statusId == 'orderApproved') {
      let order = Object.assign({},state.ordersAndItemsByPrepAreas[orderIndex])
      // change orderfile, merge parts.items when more than one
      if (order.parts.length > 1) {
        for (i=1; i < order.parts.length;i++) {
          order.parts[0].items = {...order.parts[0].items, ...order.parts[i].items } 
          order.parts.slice(i,1) // remove it
        }
      }
      order.statusId = value.statusId
      order.parts[0].statusId = value.statusId
      order.parts[0].preparationAreaId = store.getters.billingArea.preparationAreaId
      order.parts[0].description = store.getters.billingArea.description
      state.ordersAndItemsByPrepAreas.splice(orderIndex,1,order)
    } else { // cancelled or completed
      state.ordersAndItemsByPrepAreas.splice(orderIndex,1)
    }
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
    let result = []
    for (let i=0; i< state.ordersAndItemsByPrepAreas.length; i++)
      for (let p=0; p< state.ordersAndItemsByPrepAreas[i].parts.length; p++)
        if (state.ordersAndItemsByPrepAreas[i].parts[p].preparationAreaId === id)
          result.push({...state.ordersAndItemsByPrepAreas[i],
                      ...state.ordersAndItemsByPrepAreas[i].parts[p]})
    return result
  },
  preparationAreaHasOrders: state => id => {
    return getters.preparationAreaOrdersById(id).length 
  },
  prepOrdersByStatusId: state => id => { //OrderPlaced = serv,OrderApproved = bill 
    return state.ordersAndItemsByPrepAreas.filter(
        o => o.partStatusId === id)
    },
  openOrderById: state => id => {
    return state.ordersAndItemsByPrepAreas.find( o => o.orderId === id)
  },
  ordersAndItemsByPrepAreas: state => {
    return state.ordersAndItemsByPrepAreas
  },
  openOrdersByAreaSpotId: state => spotId => {
    return state.ordersAndItemsByPrepAreas.filter(
      o => o.spotId === spotId &&
      o.statusId !== 'OrderCompleted' &&
      o.statusId !== 'OrderCancelled' )
  },
}
const actions = {
  changeOrderStatus({commit}, item) {
    if (item.orderStatusId === 'OrderCancelled' || item.orderStatusId === 'OrderCompleted') {
      let spot = Object.assign({},
        store.getters.accommodationSpotById(order.spotId))
      spot.verb = 'update'
      spot.ordered = false
      store.commit('accommodationSpot', spot)
    }
    backendService.changeOrderPartStatus(
      item.orderId, null, item.statusId)
    commit('changeOrderStatus', item)
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
  async getOrders({dispatch}) {
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
