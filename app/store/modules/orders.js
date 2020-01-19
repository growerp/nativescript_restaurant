import store from '~/store'
import BackendService from "~/services/backend-service"
import PrintService from '../../services/print-service'
const backendService = new BackendService()
const printService = new PrintService()
var log = true
//if (TNS_ENV === 'production') log = false

const state = {
  // all open orders with status open(prepare), 
  // placed(serve) approved(bill) completed(done)
  openOrders: [{ 
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
    grandTotal: '', // to be removed, can be calculated
    image: '',
    preparationAreaId: '',
    prepDescription: '',
    orderPartSeqId: '',
    partStatusId: '',
    nbrOfItems: '',
    image: '',
    items: [{
      orderItemSeqId: '',
      productId: '',
      description: '',
      quantity: '',
      price: '',
      totalAmount: '', // to be removed, can be calculated
      image: '',
    }]
  }] 
}
const mutations = {
  orderStatus(state, value) {
    log?console.log("=====update order status in store: " + JSON.stringify(value)):''
    if (value.statusId === 'OrderApproved') {
      // change orderfile, merge order.items
      let firstItem = ''; let firstIndex = ''
      state.openOrders.forEach((o,index) => {
        if (o.orderId === value.orderId) {
          console.log("orderId: " + o.orderId)
          if(!firstItem) {
            console.log("firstItem")
            firstItem = o
            firstItem.statusId = value.statusId
            firstItem.partStatusId = value.statusId
            firstItem.preparationAreaId = store.getters.billingArea.preparationAreaId
            firstItem.description = store.getters.billingArea.description
            firstIndex = index
            console.log("firstItem items: " + firstItem.items.length)
          } else {
            console.log("nextItem")
            o.items.forEach(newItem => {
              let found = false
              firstItem.items.forEach((fitem, findex) => {
                if (newItem.productId === fitem.productId) { //exists?
                  console.log("found!")
                  fitem[findex].quantity += newItem.quantity
                  fitem[findex].totalAmount += newItem.totalAmount
                  found = true
                }
              })
              if (!found) {
                console.log("not found")
                firstItem.items.push(newItem)
              } 
            })
            console.log("firstItem items: " + firstItem.items.length)
            state.openOrders.splice(index,1) // remove it
          }
        }
      })
      state.openOrders.splice(firstIndex,1,firstItem)
      console.log("===new record: " + firstItem.items.length)
    } else { // cancelled or completed:  delete records
      state.openOrders.forEach((item,index) => {
        if (item.orderId === value.orderId)
          state.openOrders.splice(index,1)
      })
    }
  },
  openOrders(state, value) {
    state.openOrders = value
  },
  ordersAndItemsByPrepArea(state,value) { // need orderId and prepId
    let index = state.openOrders.findIndex(
      o => o.preparationAreaId === value.preparationAreaId &&
      o.orderId === value.orderId)
    state.openOrders.splice(index,1)
  }
}
const getters = {
  openOrderByIdAndPrepId: state => (orderId,prepId) => { 
    return state.openOrders.filter( o => 
      o.orderId === orderId && o.preparationAreaId === prepId)
  },
  openOrdersByPrepId: state => prepId => {
    return state.openOrders.filter( o => o.preparationAreaId === prepId)
  },
  preparationAreaHasOrders: state => prepId => {
    return getters.openOrdersByPrepId(prepId).length 
  },
  prepOrdersByStatusId: state => id => { //OrderPlaced = serv,OrderApproved = bill 
    return state.openOrders.filter(o => o.partStatusId === id)
  },
  openOrdersById: state => id => { // separate orders for each prepArea
    return state.openOrders.filter(o => o.orderId === id)
  },
  openOrderById: state => id => { // single record expected
    return state.openOrders.find(o => o.orderId === id)
  },
  openOrders: state => {
    let orders = []; let lastOrderId = ''
    state.openOrders.forEach( o => {
      if (!lastOrderId || o.orderId !== lastOrderId)
        orders.push(o)
      lastOrderId = o.orderId
    })
    return orders
  },
  openOrdersByAreaSpotId: state => spotId => {
    let orders = []; let lastItem = ''
    state.openOrders.forEach( o => {
      if (o.spotId === spotId &&
          o.statusId !== 'OrderCompleted' &&
          o.statusId !== 'OrderCancelled' &&
          (!lastItem || lastItem.orderId !== o.orderId)) {
        orders.push(o)
      }
      lastItem = o
    })
    return orders
  },
}
const actions = {
  async orderStatus({commit,getters}, item) {
    if (item.statusId === 'OrderCancelled' || 
        item.statusId === 'OrderCompleted') {
      let spot = Object.assign({},
        getters.accommodationSpotById(item.spotId))
      spot.verb = 'update'
      spot.ordered = false
      commit('accommodationSpot', spot)
    }
    commit('orderStatus', item)
    if (item.statusId === 'OrderApproved') {
      printService.receiptTicket(item.orderId)
    } 
    backendService.changeOrderPartStatus(item.orderId, null, item.statusId)
  }, 
  async createSalesOrder({dispatch,commit,getters}, item) {
    // set spot to ordered
    let spot = Object.assign({}, 
        store.getters.accommodationSpotById(item.header.accommodationSpotId))
    spot.verb = 'update'
    spot.ordered = true
    commit('accommodationSpot', spot)
    // remove pictures
    for (let i=0; i<item.items.length;i++) delete item.items[i].image
    let result = await backendService.createSalesOrder(item.header, item.items)
    await dispatch('getOpenOrders')
    if (item.header.orderId) { // add to existing order so use new items only for print
      console.log(" add to existing orderId: " + item.header.orderId)
      let orders = getters.openOrdersById(item.header.orderId) // multiple for every prepArea each
      console.log("orders found: " + orders.length)
      let ordersToPrint = []
      orders.forEach( order => {
        console.log(" process preparea: " + order.prepDescription)
        let printOrder = ''
        order.items.forEach( product =>{
          console.log(" process product: " + product.description)
          let found = false;
          item.items.forEach( newItem => {
            if (product.productId === newItem.productId) found = true
          })
          if (found) {
            console.log(" item found: " + product.description)
            if (!printOrder) {
              printOrder = Object.assign({}, order)
              printOrder.items = []
            }
            printOrder.items.push(product)
          }
        })
        if (printOrder) ordersToPrint.push(printOrder)
      })
      result.printer = printService.prepareTicket(ordersToPrint)
    } else {
      result.printer = printService.prepareTicket(
          getters.openOrdersById(result.data.orderId))
    }
    return result
  },
  async getOpenOrders({commit}) {
    let result = await backendService.getOpenOrders() 
    commit('openOrders', result.data.ordersAndItemsByPrepAreas)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
