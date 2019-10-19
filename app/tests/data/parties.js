const data = {
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
