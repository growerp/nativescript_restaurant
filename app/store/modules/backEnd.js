import store from '../../store'
const log = true 
const state = {
  moquiToken: '',
  activeSubscriptions: [],
}
const mutations = { //synchronous
  activeSubscriptions(state, value) {
    state.activeSubscriptions = value 
  },
  moquiToken(state, value) {
      state.moquiToken = value 
  },
  image(state, value) {
    let item = null
    switch (value.type) {
      case 'product':
        item = store.getters.productById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('product', item)
        break
      case 'category':
        item = store.getters.productCategoryById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('productCategory', item)
        break
      case 'area':
        item = store.getters.accommodationAreaById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('accommodationArea', item)
        break
      case 'prep':
        item = store.getters.preparationAreaById(value.id)
        item.image =  value.image
        item.verb = 'update'
        store.commit('preparationArea', item)
        break
      case 'task':
          item = store.getters.taskById(value.id)
          item.image =  value.image
          item.verb = 'update'
          store.commit('task', item)
          break
        case 'user':
        item = store.getters.employeeById(value.id)
        if (item == -1) item = store.getters.customerById(value.id)
        if (item == -1) console.log("party not found!")
        else {
          item.image =  value.image
          item.verb = 'update'
          if (item.roleTypeId == 'Customer')
            store.commit('customer', item)
          if (item.roleTypeId == 'Employee')
            store.commit('employee', item) }
        break
    }
  }
}
const getters = {
  activeSubscriptions: state => {
      return state.activeSubscriptions
  },
  isSubActive: state => playStoreId => {
    let isActive = false
    for (let i=0;i<state.activeSubscriptions.length;i++) {
      if (state.activeSubscriptions[i] === playStoreId) {
        isActive = true; break }}
    return isActive
  },
  moquiToken: state => {
    return state.moquiToken
  },
}
const actions = {
  
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
