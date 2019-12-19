// register, login, log intial data
import store from '~/store'
import * as dataModule from '~/tests/data/general'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
var chai = require('chai');
var assert = chai.assert; 
const appSettings = require("tns-core-modules/application-settings")
var user = {};var company = {};var orderHeader = {};var orderItems = []
describe('Connect, register and login', function () {
  this.timeout(60000);
  before(function( done ){
    user = dataModule.getRandomUser()
    company = dataModule.getRandomCompany()
    store.dispatch('register', {company: company, user: user})
    .then( function(result) {
      if (result != 'success') done("===cannot register")
      else {
        store.dispatch('login', user)
        .then( function(result) {
          if ( result != 'success') done("===cannot login, returned " + result)
          else {
            store.dispatch('loadDefaultData', [ 'kitchen','food',
                'macaroni','bar','inside','garden','drinks','cola'])
            .then( function() {
                store.dispatch('initData').then( function() {
                  assert.lengthOf(store.getters.accommodationAreas,2,
                      "check nbr of accomodation areas: 2")
                  assert.lengthOf(store.getters.preparationAreas,2,
                    "check nbr of preparation areas: 2")
                  assert.lengthOf(store.getters.accommodationSpots,25,
                    "check nbr of accomodation spot: 25")
                  assert.lengthOf(store.getters.products,2,
                    "check nbr of products: 2")
                  assert.lengthOf(store.getters.productCategories,2,
                    "check nbr of categories: 2")
                  assert.lengthOf(store.getters.employees,2,
                    "check nbr of employees: 2")
                  done()
                })
            })
          }
        })
      }
    }) 
  })

  it('enter order should show in prep, serve and bill screens', function (done) {
    orderHeader = {
      accommodationAreaId:
        store.getters.accommodationAreas[1].accommodationAreaId,
      accommodationSpotId:
        store.getters.accommodationSpots[5].accommodationSpotId}
    orderItems = []
    orderItems.push({
      productId: store.getters.products[0].productId,
      name: store.getters.products[0].name, 
      quantity: 5})
    orderItems.push({
      productId: store.getters.products[1].productId, 
      name: store.getters.products[1].name, 
      quantity: 3})
    store.dispatch('createSalesOrder', {
        header: orderHeader, items: orderItems})
    .then( function(result) {
      orderHeader.orderId = result.data.orderId
      assert.exists(result.data.orderId, 'No orderid returned')
      assert.isString(result.data.orderId, 'Orderid is not a string')
      assert.isNumber(parseInt(result.data.orderId, 10), 
          "returned orderId should be a number")
      console.log("=====check local order lists")
      assert.lengthOf(store.getters.openOrders, 1, "Orders not received yet")
      assert.lengthOf(store.getters.ordersAndItemsByPrepAreas, 2,
          "Preparation Orders not received yet")
      console.log("check prep area 1")
      let preparationAreaId =  
          store.getters.preparationAreaIdByProductId(orderItems[0].productId)
      let orderParts = store.getters.preparationAreaOrdersById(preparationAreaId)
          assert.exists(orderParts, "No parts found in: " +
          store.getters.preparationAreaById(preparationAreaId).description)
      assert.lengthOf(orderParts,1,
          "Order item 1 " + orderHeader.orderId + " product: " +
          orderItems[0].name + " was not found in preparation area: " +
          store.getters.preparationAreaById(preparationAreaId).description) 

      console.log("========change part 1 status to serv")
      store.dispatch('changeOrderPartStatus', {
          orderId: orderParts[0].orderId, 
          partId: orderParts[0].orderPartSeqId,
          statusId: 'serv'})
      assert.lengthOf(store.getters.prepOrdersByStatusId('OrderPlaced'),1,
          " not appear in serv screen")

      console.log("=====change part 1 status to bill")
      store.dispatch('changeOrderPartStatus', {
        orderId: orderParts[0].orderId, 
        partId: orderParts[0].orderPartSeqId,
        statusId: 'bill'})
      assert.lengthOf(store.getters.prepOrdersByStatusId('OrderPlaced'),0,
          " not disappear from serv screen")
      assert.lengthOf(store.getters.ordersByStatusId('OrderApproved'),0,
            " should not appear in bill screen YET")

      console.log("check prep area 2")
      preparationAreaId =  
          store.getters.preparationAreaIdByProductId(orderItems[1].productId)
      orderParts = store.getters.preparationAreaOrdersById(preparationAreaId)
      assert.exists(orderParts, "No parts found in: " +
          store.getters.preparationAreaById(preparationAreaId).description)
      assert.lengthOf(orderParts, 1,
          "Order item 2 " + orderHeader.orderId + " product: " +
          orderItems[1].name + " was not found in preparation area: " +
          store.getters.preparationAreaById(preparationAreaId).description)

      console.log("========change part 2 status to serv")
      store.dispatch('changeOrderPartStatus', {
        orderId: orderParts[0].orderId, 
        partId: orderParts[0].orderPartSeqId,
        statusId: 'serv'})
        console.log("===check if show")
        assert.lengthOf(store.getters.prepOrdersByStatusId('OrderPlaced'),1,
          " not appear in serv screen")

      console.log("=====change part 2 status to bill")
      store.dispatch('changeOrderPartStatus', {
        orderId: orderParts[0].orderId, 
        partId: orderParts[0].orderPartSeqId,
        statusId: 'bill'})
      assert.lengthOf(store.getters.prepOrdersByStatusId('OrderPlaced'),0,
          " not disappear from serv screen")
      assert.lengthOf(store.getters.ordersByStatusId('OrderApproved'),1,
            " should now appear in bill screen ")

      console.log("=========change part status to complete")
      store.dispatch('changeOrderPartStatus', {
        orderId: orderParts[0].orderId, 
        statusId: 'completed'})
      assert.lengthOf(store.getters.prepOrdersByStatusId('OrderApproved'),0,
        " not disappear from bill screen")

      // check if show in reports
      backendService.getOrders(false, null).then( function(result) {
        assert.lengthOf(result.data.ordersAndItems, 1, "order not found in report")
      })
      done()
    });
  });
  it('Preparation Location CRUD test', function (done) {
    done()
  });
  it('Accommodation Area CRUD test', function (done) {
    done()
  });
  it('Employee CRUD test', function (done) {
    done()
  });
  it('Customer CRUD test', function (done) {
    done()
  });
  it('Company CRUD test', function (done) {
    done()
  });
  it('MyIndfo CRUD test', function (done) {
    done()
  });
});
