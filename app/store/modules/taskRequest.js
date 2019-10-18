import store from '../../store'
var log = true
if (TNS_ENV === 'production') log = false
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
  faqs: [{
    requestId: '',
    requestName: '',
  }],
  notes: [{
    requestId: '',
    timeStamp: '',
    date: '', // 'dd-MM-yyyy'
    noteText: '',
    partyId: '',
    fullname: ''
  }]
}

const mutations = {
  note(state, value) {
    if (log) console.log("====note incoming update:" + JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      state.notes.push(value)
    }
  },
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
  request(state, value) {
    if (log) console.log("====request incoming update:" + JSON.stringify(value))
    let verb = value.verb ; delete value.verb
    if (verb === 'add') {
      let i = 0
      for (i; i<state.requests.length;i++)
        if (value.requestName.toLowerCase() < state.requests[i].requestName.toLowerCase())
          break;
      state.requests.splice(i,0,value)
      console.log("====pushing note: " + JSON.stringify(value.note))
      if (value.note) state.notes.push(value.note)
    } else {
      let index = state.requests.findIndex(
        o => o.requestId === value.requestId)
      if (index == -1) {
         console.log("request not found:" + value.requestId) }
      else if (verb == 'delete') {
        state.requests.splice(index,1)
      } else if (verb == 'update') {
        state.requests.splice(index,1,value)
      }
    }
  },
  requests(state, value) {
    state.requests = value.requests 
    state.faqs = value.faqs 
    state.notes = value.notes 
  },
}
const getters = {
  myTasks: state => {
    return state.myTasks
  },
  requests: state => {
    return state.requests
  },
  faqs: state => {
    return state.faqs
  },
  faqsAndNotes: state => {
    let faqsAndNote = state.faqs
    for (let i=0;i<faqsAndNote.length; i++){
      faqsAndNote[i].notes = store.getters.noteByRequest(
          faqsAndNote[i].requestId)
        }
    return faqsAndNote
  },
  RequestAndNotes: state => {
    let ReqsAndNotes = state.requests
    for (let i=0;i<ReqsAndNotes.length; i++){
      ReqsAndNotes[i].notes = store.getters.noteByRequest(
        ReqsAndNotes[i].requestId)
        }
    return ReqsAndNotes
  },
  noteByRequest: state => requestId => {
      return state.notes.filter(o => o.requestId === requestId)
  },
  otherTasks: state => {
    return state.otherTasks
  },
  taskById: state => id => {
    let result = state.myTasks.find(o => o.workEffortId === id)
    if (typeof result === "undefined") 
      result = state.otherTasks.find(o => o.workEffortId === id)
    return typeof(result) != "undefined" ? result : -1
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
