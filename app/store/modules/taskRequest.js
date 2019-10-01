import store from '../../store'
const log = true 
const state = {
  myTasks: [{
    workEffortId: '',
    statusId: '',
    workEffortName: '',
    description: '',
    priority: '',
    ownerPartyId: '',
    ownerFullName: '', // lastName + ', ' + firstName
    userPartyId: '',
    userFullName: '', // lastName + ', ' + firstName
    image: ''
  }],
  otherTasks: [{
    workEffortId: '',
    statusId: '',
    workEffortName: '',
    description: '',
    priority: '',
    ownerPartyId: '',
    ownerFullName: '', // lastName + ', ' + firstName
    userPartyId: '',
    userFullName: '', // lastName + ', ' + firstName
    image: ''
  }],
  requests: [{
    requestId: '',
    requestName: '',
  }],
  notes: [{
    requestId: '',
    date: '', // 'dd-MM-yyyy'
    noteText: '',
    partyId: '',
    fullname: ''
  }]
}

const mutations = {
  task( state, value) {
    if (log) console.log("====task incoming update:" + JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      addToList(value.userPartyId == store.getters.currentEmployeePartyId?
                            state.myTasks : state.otherTasks) 
    } else {
      let myIndex = state.myTasks.findIndex(
        o => o.workEffortId === value.workEffortId)
      let otherIndex = state.otherTasks.findIndex(
          o => o.workEffortId === value.workEffortId)
      if (myIndex == -1 && otherIndex == -1) {
        if (log) console.log("task not found:" + value.workEffortName) }
      else if (verb == 'delete') {
        if (myIndex != -1) state.myTasks.splice(myIndex,1)
        else state.otherTasks.splice(otherIndex,1)
      }
      else if (verb == 'update') {
        if (myIndex != -1 && value.userPartyId == state.myTasks[myIndex].userPartyId)
          state.myTasks.splice(myIndex,1,value) // userparty not changed
        else if (otherIndex != -1 && value.userPartyId == state.otherTasks[otherIndex].userPartyId)
          state.myTasks.splice(otherIndex,1,value) // userparty not changed
        // have to move list
        else if (otherIndex != -1) {
          state.otherTasks.splice(otherIndex,1)
          addToList(state.myTasks)
        } else {
          state.myTasks.splice(myIndex,1)
          addToList(state.otherTasks)
        }
      }
    }
    function addToList(listToAdd) {
      if (listToAdd == state.myTasks) console.log("adding to myTasks")
      if (listToAdd == state.otherTasks) console.log("adding to otherTasks")
      let i = 0
      for (i; i<listToAdd.length;i++)
        if ((value.priority + value.workEffortName.toLowerCase()) < 
              listToAdd[i].priority + listToAdd[i].workEffortName.toLowerCase())
        break;
      listToAdd.splice(i,0,value)
    }
  },
  tasks(state, value) {
    state.myTasks = value.myTasks
    state.otherTasks = value.otherTasks
  },
  request( state, value) {
    if (log) console.log("====request incoming update:" + JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.requests.length;i++)
        if (value.requestName.toLowerCase() < state.requests[i].requestName.toLowerCase())
          break;
      state.requests.splice(i,0,value)
    } else {
      let index = state.requests.findIndex(
        o => o.requestId === value.request)
      if (index == -1) {
        if (log) console.log("party not found:" + value.requestId) }
      else if (verb == 'delete') {
          state.requests.splice(index,1)
      } else if (verb == 'update') {
        state.requests.splice(index,1,value)
      }
    }
  },
  requests(state, value) {
      state.tasks = value 
  },
  notes(state, value) {
      state.tasks = value 
  },
}
const getters = {
  myTasks: state => {
    return state.myTasks
  },
  otherTasks: state => {
    return state.otherTasks
  }
}
// export this module.
export default {
  state,
  mutations,
  getters
}
