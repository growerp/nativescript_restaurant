// register, login, log intial data
import store from '~/store'
import * as dataModule from '~/tests/data/general'
const appSettings = require("tns-core-modules/application-settings")
var user = {}
var company = {}
describe('Connect, register and login', function () {
  this.timeout(8000);
  describe('initialization' , function() {
    it('just make sure we delete existing data', function (done) {
      appSettings.clear()
      done()
    });
    it('should return "register" on first connection test', function (done) {
      store.dispatch('getConnection').then( result => {
        done()
        assert.equal( result == 'register')})
    });
    it('register should return "success"', function (done) {
      user = dataModule.getRandomUser()
      company = dataModule.getRandomCompany()
      store.dispatch('register', {company: company, user: user})
      .then( result => {
        assert.equal( result == 'success') })
        done()
    })
    it('login should return "success"', function (done) {
      store.dispatch('login', user).then( result => {
        assert.equal( result == 'success') })
        done()
    })
	});
});
