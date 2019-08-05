const state = {
        apiKey: '',
        dashBoard: [],
        moquiToken: '',
        user: {
            partyId: '',
            userId: '',
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            image: '',
            locale: '',
            userGroupId: '',
            groupDescription: ''
        },
        users: [],
        company: {
            name: '',
            id: '',
            currency: '',
            email: '',
            img: ''
        },
        userGroups:[],
        areasAndSpots:[],
        categoriesAndProducts: [],
        prepAreasAndCategories: [],
        dashboard: [],
        customerProvider: [],
        openOrders: [],
        activeSubscriptions: [],
    }
    const appSettings = require("tns-core-modules/application-settings")
    const mutations = { //synchronous
        customerProvider(state, value) {
          state.customerProvider = value },
        activeSubscriptions(state, value) {
            state.activeSubscriptions = value },
        openOrders(state, value) {
            state.openOrders = value },
        categoriesAndProducts(state, value) {
          state.categoriesAndProducts = value },
        areasAndSpots(state, value) {
          state.areasAndSpots = value },
        userGroups(state, value) {
          state.userGroups = value },
        prepAreasAndCategories(state, value) {
          state.prepAreasAndCategories = value },
        apiKey(state, value) {
            state.apiKey = value
            appSettings.setString('apiKey', value)},
        moquiToken(state, value) {
            state.moquiToken = value },
        user(state, value) {
            appSettings.setString('username', value.name)
            state.user = value },
        username(state,value) {
            state.user.name = value
            appSettings.setString('username', value) },
        users(state, value) {
            state.users = value },
        company(state, value) {
            state.company = value
            appSettings.setString('companyname', value.name)},
        appSettings(state, value) {
            state.apiKey = value.apiKey
            state.company.name = value.companyname
            state.user.name = value.username}
}
const getters = {
        customerProvider: state => {
          return state.customerProvider },
        openOrders: state => {
            return state.openOrders },
        activeSubscriptions: state => {
            return state.activeSubscriptions },
        isSubActive: state => playStoreId => {
          let isActive = false
          for (let i=0;i<state.activeSubscriptions.length;i++) {
            if (state.activeSubscriptions[i] === playStoreId)
              isActive = true; break}
          return isActive
        },
        openOrdersByAreaSpot: state => (areaId, spotId) => {
          let openOrders = []
          for (let i=0; i<state.openOrders.length;i++) {
            if (state.openOrders[i].accommodationAreaId === areaId &&
                state.openOrders[i].accommodationSpotId === spotId)
              openOrders.push(state.openOrders[i])}
          return openOrders },
        categoriesAndProducts: state => {
            return state.categoriesAndProducts },
        categoryById: (state) => (id) => {
          for (let record = 0; record < state.categoriesAndProducts.length; record++) {
            if (state.categoriesAndProducts[record].productCategoryId === id) {
                return state.categoriesAndProducts[record]}}},
        categories: state => {
            let categories = []
            for(let i=1;i<= state.categoriesAndProducts.length;i++) {
                categories.push(i + '-' + state.categoriesAndProducts[i-1].name)}
            return categories},
        categoryByDesc: (state) => (desc) => {
            for (let record = 0; record < state.categoriesAndProducts.length;record++) {
              if ((record+1) + '-' + state.categoriesAndProducts[record].name === desc) {
                return state.categoriesAndProducts[record]}}},
        areas: state => {
          let areas = []
          for(let i=1;i<= state.areasAndSpots.length;i++) {
              areas.push(i + '-' + state.areasAndSpots[i-1].description)}
          return areas},
        areaById: (state) => (id) => {
            for (let record = 0; record < state.areasAndSpots.length;record++) {
              if (state.areasAndSpots[record].accommodationAreaId == id) {
                return state.areasAndSpots[record]}}},
        areaByDesc: (state) => (desc) => {
            for (let record = 0; record < state.areasAndSpots.length;record++) {
              if ((record+1) + '-' + state.areasAndSpots[record].description === desc) {
                return state.areasAndSpots[record]}}},
        areasAndSpots: state => {
            return state.areasAndSpots },
        userGroups: state => {
            return state.userGroups },
        userGroupValues: state => {
          let values = []
          for(let i=0;i < state.userGroups.length;i++)
            values[i] = state.userGroups[i].description
          return values },
        prepAreasAndCategories: state => {
            return state.prepAreasAndCategories },
        user: state => {
          return state.user},
        users: state => {
          return state.users},
        userNames: state => { // ignore own name
          var names = []
          for(let i=0;i < state.users.length;i++)
              names.push(state.users[i].firstName + ' ' + state.users[i].lastName)
          return names},
        userByFirstLastName: state => fullName => {
            for (let i= 0; i < state.users.length;i++) {
              if (state.users[i].firstName + ' ' +
                    state.users[i].lastName === fullName) {
                return state.users[i].partyId}}},
        company: state => {
            return state.company},
        apiKey: state => {
            return state.apiKey},
        moquiToken: state => {
            return state.moquiToken}
    }
// export this module.
export default {
  state,
  mutations,
  getters
}
