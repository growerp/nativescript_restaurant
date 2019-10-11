import Vue from 'nativescript-vue'
import Vuex from 'vuex'

import sideDrawer from './modules/sideDrawer'
import backEnd from './modules/backEnd'
import locCatProd from './modules/locCatProd'
import orders from './modules/orders'
import parties from './modules/parties'
import taskRequest from './modules/taskRequest'
//import database from './modules/database'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    sideDrawer,
    backEnd,
    locCatProd,
    orders,
    parties,
    taskRequest,
  },
  strict: debug
})

Vue.prototype.$store = store
export default store

