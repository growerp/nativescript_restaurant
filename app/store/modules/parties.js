const appSettings = require("tns-core-modules/application-settings")
import store from '../../store'
import BackendService from "~/services/backend-service"
const backendService = new BackendService()

var log = true
if (TNS_ENV === 'production') log = false 
const state = {
  currentEmployeePartyId: String,
  currentEmployeeUserGroupId: String, // needed before the home screen
  employees: [{ // all users except customers
    roleTypeId: '',
    partyId: '',
    username: '', // login id
    name: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    image: '',
    locale: '',
    userGroupId: '',
    groupDescription: '',
    device: '' // 'IOS' 'Android']
  }],
  customers: [{ // all customers
    roleTypeId: '',
    partyId: '',
    name: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    image: '',
    locale: '',
    externalId: '',
    device: '' // 'IOS' 'Android']
  }],
  company: {
    partyId: '',
    organizationName: '',
    currencyId: '',
    emailAddress: '',
    image: '',
  },
  userGroups:[{
    userGroupId: String,
    description: String
  }],
}
const mutations = {
  allPartyInfo(state, value) {
    state.currentEmployeePartyId = value.currentEmployeePartyId
    state.employees = value.employees
    state.customers = value.customers
    state.company = value.company
    appSettings.setString('organizationName', value.company.organizationName)
    appSettings.setString('username', 
      state.employees.find(o => o.partyId === state.currentEmployeePartyId).username)
    state.currentEmployeeUserGroupId = 
        state.employees.find(o => o.partyId === state.currentEmployeePartyId).userGroupId
    state.userGroups = value.userGroups
  },
  company(state,value) {
    state.company = value
  },
  currentEmployeeUserGroupId(state, value) {
    state.currentEmployeeUserGroupId = value
  },
  customer(state,value) {
    if (log) console.log("====party customer incoming update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.customers.length;i++)
        if ((value.lastName.toLowerCase()+value.firstName.toLowerCase()) < 
          state.customers[i].lastName.toLowerCase()+state.customers[i].firstName.toLowerCase())
          break;
      state.customers.splice(i,0,value)
    } else {
      let index = state.customers.findIndex(
        o => o.partyId === value.partyId)
      if (index == -1) {
        if (log) console.log("party not found:" + value.partyId) }
      else if (verb == 'delete') {
          state.customers.splice(index,1)
      } else if (verb == 'update') {
        state.customers.splice(index,1,value)
      }
    }
  },
  employee(state,value) {
    if (log) console.log("====party employee incoming update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.employees.length;i++)
        if ((value.lastName.toLowerCase()+value.firstName.toLowerCase()) < 
          state.employees[i].lastName.toLowerCase()+state.employees[i].firstName.toLowerCase())
          break;
      state.employees.splice(i,0,value)
    } else {
      let index = state.employees.findIndex(
        o => o.partyId === value.partyId)
      if (index == -1) {
        if (log) console.log("party not found:" + value.partyId) }
      else if (verb == 'delete') {
          state.employees.splice(index,1)
      } else if (verb == 'update') {
        state.employees.splice(index,1,value)
      }
    }
  },
}
const getters = {
  company: state => {
    return state.company
  },
  currentEmployee: state => {
    return state.employees.find(o => o.partyId === state.currentEmployeePartyId)
  },
  currentEmployeeFullName: state => {
    return store.getters.currentEmployee.lastName + ', ' +
      store.getters.currentEmployee.firstName
  },
  currentEmployeePartyId: state => {
    return  state.currentEmployeePartyId
  },
  currentEmployeeUserGroupId: state => {
    return state.currentEmployeeUserGroupId
  },
  customerById: state => id => {
    let result = state.customers.find(o => o.partyId === id)
    return typeof(result) != "undefined" ? result : -1
  },
  customerProvider: state => {
    let result = []
    for(let i=0;i<state.customers.length;i++)
      result.push(state.customers[i].externalId + ' ' + 
                  state.customers[i].firstName + ' ' +
                  state.customers[i].lastName)
    return result
  },
  customers: state => {
    return state.customers
  },
  customersSearchName: state => name => {
    return state.customers.filter( o =>
      (o.firstName.toLowerCase().indexOf(name.toLowerCase()) > -1) ||
      (o.lastName.toLowerCase().indexOf(name.toLowerCase()) > -1))
  },
  employeeByDesc: state => desc => {
    return state.employees.find(o => 
      (o.lastName + ', ' + o.firstName) === desc)
  },
  employeeById: state => id => {
    let result = state.employees.find(o => o.partyId === id)
    return typeof(result) != "undefined" ? result : -1
  },
  employeeDesc: state => (blank = true) => {
    let values = []
    if (blank) values.push(' ')
    for(let i=0;i < state.employees.length;i++)
      values.push(state.employees[i].lastName + ', ' + state.employees[i].firstName)
    return values
  },
  employees: state => {
    return state.employees
  },
  employeesSearchName: state => name => {
    return state.employees.filter( o =>
      (o.firstName.toLowerCase().indexOf(name.toLowerCase()) > -1) ||
      (o.lastName.toLowerCase().indexOf(name.toLowerCase()) > -1))
  },
  userGroups: state => {
    return state.userGroups
  },
  userGroupByDesc: state => desc => {
    for (let i=0; i < state.userGroups.length;i++)
      if (state.userGroups[i].description === desc)
        return state.userGroups[i]
    return -1 
//    this does not work
//    return state.userGroups.find(o => {o.description === desc })
  },
  userGroupsDesc: state => (blank = true) => {
    let values = []
    if (blank) values.push(' ')
    for(let i=0;i < state.userGroups.length;i++)
      values.push(state.userGroups[i].description)
    return values
  },
}
const actions = {
  updateCompany({commit}, item) {
    backendService.updateCompany(item)
    commit('company', item)
  },
  updateUser({commit}, item) {
    if (log) console.log("====party incoming update:" +
        JSON.stringify(item))
    backendService.updateUser(item)
    item.verb = 'update'
    if (item.roleTypeId == 'Customer')
      commit('customer', item)
    if (item.roleTypeId == 'Employee')
      commit('employee', item)
  }
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
