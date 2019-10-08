var expect = require('chai').expect;
import store from '../store'
import BackendService from "~/services/backend-service"
import { isConstructSignatureDeclaration } from 'typescript';
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

    // test a functionality
    it('test Login function.', async function() {
        var resultName = null;
            await backendService.login(user).then(function(result) {
            resultName = result.data.user.name;
            backendService.saveKey(result.data.apiKey)
            appSettings.setString('apiKey', result.data.apiKey)
            store.commit('moquiToken', result.data.moquiSessionToken)
            backendService.saveToken()
        });
        expect(resultName).to.equal(user.name);
    });
    // Start to test function Abuout Preparation
    it('test create Preparation Area function.', async function() {
        await backendService.createPreparationArea(preparationArea).then(function(result) {
            preparationArea.preparationAreaId = result.data.preparationAreaId;
        });
        expect(preparationArea.preparationAreaId).to.not.be.null;
    });

    it('test update Preparation Area function.', async function() {
        preparationArea.description = 'Kitchen';
        var descriptionUpdate = null;
        await backendService.updatePreparationArea(preparationArea).then(function(result) {
            let obj = JSON.parse(result.config.data);
            descriptionUpdate = obj.description;
        });
        expect(descriptionUpdate).to.equal(preparationArea.description);
    });

    it('test delete Preparation Area function.', async function() {
        await backendService.deletePreparationArea(preparationArea.preparationAreaId).then(function(result) {});
        // Need to fix : function to check Preparation delete
    });
    //end test function Preparation

});
