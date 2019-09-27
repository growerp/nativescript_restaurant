var expect = require('chai').expect;
import BackendService from "~/services/backend-service"
const backendService = new BackendService();
const user = {
    name: 'test@antwebsystems.com',
    password: 'Moqui123!'
}
describe('Test REST API', function() {
    // test a functionality
    it('Test appSettings function.', async function() {
        var resultName = null;
        await backendService.login(user).then(function(result) {
            resultName = result.data.user.name;
        });
        expect(resultName).to.equal(user.name);
    })
    it('Check the company.', async function() {
        // test function 2
    })

});
