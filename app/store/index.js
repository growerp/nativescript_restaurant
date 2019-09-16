import Vue from 'nativescript-vue'
import Vuex from 'vuex'

import sideDrawer from './modules/sideDrawer'
import backEnd from './modules/backEnd'
import locCatProd from './modules/locCatProd'
//import database from './modules/database'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  modules: {
    sideDrawer,
    backEnd,
    locCatProd,
  },
  strict: debug
})

Vue.prototype.$store = store
export default store

