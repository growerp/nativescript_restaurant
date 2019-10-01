const appSettings = require("tns-core-modules/application-settings")
import store from '../../store'

const log = true 
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
    img: '',
  },
  userGroups:[{
    userGroupId: String,
    description: String
  }],
}
const mutations = {
  currentEmployeeUserGroupId(state, value) {
    console.log("====value: " + value)
    state.currentEmployeeUserGroupId = value
  },
  company(state,value) {
    state.company = value
  },
  customer(state,value) {
    if (log) console.log("====party customer incoming update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.customers.length;i++)
        if ((value.lastName.toLowerCase()+value.firstName.toLowerCase()) < 
          state.customers[i].lastName.toLowerCase()+state.customers[i].lastName.toLowerCase())
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
  employee(state,value) {
    if (log) console.log("====party employee incoming update:" +
        JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.employees.length;i++)
        if (value.name.toLowerCase() < state.employees[i].name.toLowerCase())
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
  }
}
const getters = {
  company: state => {
    return state.company
  },
  currentEmployee: state => {
    return state.employees.find(o => o.partyId === state.currentEmployeePartyId)
  },
  currentEmployeeUserGroupId: state => {
    return state.currentEmployeeUserGroupId
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
  employees: state => {
    return state.employees
  },
  userGroupsDesc: state => (blank = true) => {
    let values = []
    if (blank) values.push(' ')
    for(let i=0;i < state.userGroups.length;i++)
      values.push(state.userGroups[i].description)
    return values
  },
}
// export this module.
export default {
  state,
  mutations,
  getters
}
