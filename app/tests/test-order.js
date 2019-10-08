import store from '../store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService();
const appSettings = require("tns-core-modules/application-settings")
const usertest = {
    name: 'test@antwebsystems.com',
    password: 'Moqui123!',
    partyId: '100176',
    locale: 'TH',
    roleTypeId: 'Employee',
    full: false,
    companyName: 'My litle Restaurant'
}
const ordertest = {
    description: 'Garden',
    accommodationSpotId: '100280',
    spotNumber: '1',
    newExternalId: '0903190109',
    externalId: '',
    nbrOfGuests: 3
}
const tabletest = {
    accommodationAreaId : '100160',
    accommodationSpotId : '100280'
}
// A sample Mocha test
describe('#Order()', function () {
    var orderItems = [];
    var product = null;
    var orderId = null;
    beforeEach(async function() {
        await backendService.login(usertest).then(function(result) {
            backendService.saveKey(result.data.apiKey)
            appSettings.setString('apiKey', result.data.apiKey)
            store.commit('moquiToken', result.data.moquiSessionToken)
            backendService.saveToken()
        });
    });

    it('createOrder', async function () {
            await backendService.getAllProductInfo().then(function(result) {
                product = store.getters.products[0]; // Now can't get data from function initData()
            });
            orderItems.push(product)
            orderItems.quantity = '1';
            await backendService.createSalesOrder(ordertest, orderItems).then(function(result) {
                orderId = result.data.orderId;
            });
            assert.equal(orderId, !null)
    });
});