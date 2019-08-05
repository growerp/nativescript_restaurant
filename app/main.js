import Vue from 'nativescript-vue'
import RadListView from 'nativescript-ui-listview/vue'
import RadDataForm from 'nativescript-ui-dataform/vue'
import RadChart from 'nativescript-ui-chart/vue'
import Vuex from 'vuex'
import BackendService from "~/services/backend-service"
import routes from '~/router'
import store from '~/store'
import sideDrawer from '~/components/sideDrawer'
import drawerContent from '~/components/drawerContent'
import VueI18n from 'vue-i18n'
import messages from '~/lang/messages'
import dateTimeFormats from './lang/dateTimeFormats'
import numberFormats from './lang/numberFormats'
import Pager from 'nativescript-accordion/vue'

Vue.use(RadListView)
Vue.use(RadChart)
Vue.use(RadDataForm)
Vue.use(Pager)

Vue.use(Vuex)
Vue.use(VueI18n)

Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown)
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
const backendService = new BackendService()
Vue.prototype.$backendService = backendService
Vue.prototype.$routes = routes

var purchase = require("nativescript-purchase");
if (process.env.NODE_ENV === 'production') {
  global.initPurchase = purchase.init(["10010","10011","10003"])
  global.subscriptions = [
    { func: "noAdds", productIdentifyer: "10010"},
    { func: "users03", productIdentifyer: "10011"},
    { func: "users10", productIdentifyer: "10003"}]
} else {
  global.initPurchase = purchase.init(["android.test.purchased","android.test.canceled","android.test.item_unavailable"])
  global.subscriptions = [
    { func: "noAdds", productIdentifyer: "android.test.purchased"},
    { func: "users03", productIdentifyer: "android.test.purchased"},
    { func: "users10", productIdentifyer: ""}]
}
const platformModule = require("tns-core-modules/platform");
let locale;
  if (platformModule.isAndroid) {
    locale = java.util.Locale.getDefault().getLanguage();
  }
  if (platformModule.isIOS) {
    locale = NSLocale.preferredLanguages.firstObject;
  }

  // global variables
  global.noImage = '~/assets/images/addImage.png'
  global.locale = locale

export const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: locale,
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  messages,
  dateTimeFormats,
  numberFormats
})
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// init values from application settings
const appSettings = require("tns-core-modules/application-settings");
store.commit('appSettings', {
    apiKey: appSettings.getString("apiKey"), // to avoid need for logging in
    username: appSettings.getString("username"), // when logging in already show username
    companyname: appSettings.getString("companyname"), // on the login screen show restaurant name
})

var application = require("tns-core-modules/application");
application.on(application.discardedErrorEvent, function (args) {
    console.log('====discarded error args: ' + JSON.stringify(args.error))
    const error = args.error;
//    console.log("===Received discarded exception: ");
    console.log('===message:' + error.message);
//    console.log('===Stack trace:' + error.stackTrace);
//    console.log('===nativeException:' + error.nativeException);
    let start = error.stackTrace.indexOf("ReferenceError: ") + 16
    if (start == 15) start = error.stackTrace.indexOf("java.lang.Exception: ") + 21
    let end = error.stackTrace.indexOf("\n",start)
    global.exceptionErrorMessage = error.stackTrace.substring(start,end)
    console.log('==discarded ErrorEvent message: ' + global.exceptionErrorMessage)
});

new Vue({
    i18n,
    store,
    render (h) {
        return h(
            sideDrawer, [
                h(drawerContent, { slot: 'drawerContent'}),
                h(routes.Login, { slot: 'mainContent'})
            ]
        )
    }
}).$start()
