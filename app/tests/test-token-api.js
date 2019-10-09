import store from '../store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()
describe('Test REST API', function() {
    const random = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    const user = {
        firstName: 'Peter',
        lastName: 'test',
        name: random + '@example.com',
        emailAddress: random + '@example.com',
        password: 'Moqui123!'
    }
    const company = {
        name: 'Test restaurant',
        currency: 'THB',
        emailAddress: random + '@example.com',
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
    
    describe("get moqui token", async function() {
      await backendService.getToken().then( function() {
        it('should return a not null string', function() {
            assert(result.data != null)
            backendService.saveToken(result.data)
        })
      })
    })
    
    describe("Register user/comp", async function() {
      await backendService.register(user,company).then( function() {
        it('should return user name and apiKey', function() {
            assert(result.data.user.name == user.name)
            assert(result.data.apiKey == null)
            backendService.saveKey(result.data.apiKey)
            console.log("====apiKey" + result.data.apiKey)
        })
      })
    })
    
});
