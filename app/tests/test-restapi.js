import store from '../store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService();
const appSettings = require("tns-core-modules/application-settings")

describe('Test REST API', function() {
    const user = {
        name: 'test@antwebsystems.com',
        password: 'Moqui123!'
    }
    const preparationArea = {
        description: 'Kitchens',
        preparationAreaId: null
    }
    const tableArea = {
        description: 'TesttableAreas',
        nbrOfSpots: '5',
        accommodationAreaId: null
    }

    const employeetest = {
        firstName: 'Employee',
        lastName: 'Test',
        emailAddress: 'Employee@antwebsystems.com',
        roleTypeId: 'Employee',
        locale: 'en',
        groupDescription: 'Employee',
        externalId: '',
        partyId: ''
    }

    const customertest = {
        firstName: 'Customer',
        lastName: 'Test',
        emailAddress: 'Customer@antwebsystems.com',
        roleTypeId: 'Customer',
        locale: 'en',
        groupDescription: 'Customer',
        externalId: '99997',
        partyId: ''
    }

    // test a functionality
    it('test Login function.', async function() {
        var resultName = null;
        await backendService.getToken().then (resultToken => {
            store.commit('moquiToken', resultToken.data)
            backendService.saveToken(resultToken.data)
        });
        await backendService.login(user).then(function(result) {
            resultName = result.data.user.name;
            backendService.saveKey(result.data.apiKey)
            appSettings.setString('apiKey', result.data.apiKey)
            store.commit('moquiToken', result.data.moquiSessionToken)
            backendService.saveToken()
        });
        assert.equal(resultName, user.name);
    });
    // Start to test function Abuout Preparation
    it('test create Preparation Area function.', async function() {
        await backendService.createPreparationArea(preparationArea).then(function(result) {
            preparationArea.preparationAreaId = result.data.preparationAreaId;
        });
        assert.equal(preparationArea.preparationAreaId, !null)
    });

    it('test update Preparation Area function.', async function() {
        preparationArea.description = 'Kitchen';
        var descriptionUpdate = null;
        await backendService.updatePreparationArea(preparationArea).then(function(result) {
            let obj = JSON.parse(result.config.data);
            descriptionUpdate = obj.description;
        });
        assert.equal(descriptionUpdate,preparationArea.description);
    });

    it('test delete Preparation Area function.', async function() {
        await backendService.deletePreparationArea(preparationArea.preparationAreaId).then(function(result) {});
        // Need to fix : function to check Preparation delete
    });

    // Start to test function abuout table areas
    it('test create table Area function.', async function() {
        await backendService.createAccommodationArea(tableArea).then(function(result) {
            tableArea.accommodationAreaId = result.data.accommodationAreaId;
        });
        expect(tableArea.accommodationAreaId).to.not.be.null;
    });
    it('test update table Area function.', async function() {
        tableArea.description = 'TableAreas';
        var descriptionUpdate = null;
        await backendService.updateAccommodationArea(tableArea).then(function(result) {
            descriptionUpdate = result.data.accommodationArea.description;
        });
        expect(descriptionUpdate).to.equal(tableArea.description);
    });
 
    it('test delete table Area function.', async function() {
        await backendService.deleteAccommodationArea(tableArea.accommodationAreaId).then(function(result) {});
        // Need to fix : function to check table area delete
    });

    // Start to test function abuout Employee
    it('test create Employee function.', async function() {
        await backendService.createUser(employeetest).then(function(result) {
            employeetest.partyId = result.data.partyId;
        });
        expect(employeetest.partyId).to.not.be.null;
    });

    it('test update Employee function.', async function() {
        employeetest.firstName = 'Employeetest';
        var firstNameUpdate = null;
        await backendService.updateUser(employeetest).then(function(result) {
            let obj = JSON.parse(result.config.data);
            firstNameUpdate = obj.firstName;
        });
        expect(firstNameUpdate).to.equal(employeetest.firstName);
    });

    it('test delete Employee function.', async function() {
        await backendService.deleteUser(employeetest.partyId).then(function(result) {});
        // Need to fix : function to check Employee delete
    });

     // Start to test function abuout Customer
     it('test create Customer function.', async function() {
        await backendService.createUser(customertest).then(function(result) {
            customertest.partyId = result.data.partyId;
        });
        expect(customertest.partyId).to.not.be.null;
    });

    it('test update Customer function.', async function() {
        customertest.firstName = 'Customertest';
        var firstNameUpdate = null;
        await backendService.updateUser(customertest).then(function(result) {
            let obj = JSON.parse(result.config.data);
            firstNameUpdate = obj.firstName;
        });
        expect(firstNameUpdate).to.equal(customertest.firstName);
    });
 
    it('test delete Employee function.', async function() {
        await backendService.deleteUser(customertest.partyId).then(function(result) {});
        // Need to fix : function to check Customer delete
    });

});
