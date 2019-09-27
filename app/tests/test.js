var expect = require('chai').expect;
import BackendService from "~/services/backend-service"
const backendService = new BackendService();
const user = {
    name: 'test@antwebsystems.com',
    password: 'Moqui123!'
}
describe('#function Login ()', function() {
    // test a functionality
    it('username input should same user to result', async function() {
        var resultName = null;
        await backendService.login(user).then(function(result) {
            resultName = result.data.user.name;
        });
        expect(resultName).to.equal(user.name);
    })
    it('example test 2', async function() {
        // test function 2
    })

});
