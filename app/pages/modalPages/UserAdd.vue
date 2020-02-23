<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="actionText" horizontalAlignment="center" class="h2"/>
      <label :text="header" horizontalAlignment="center" class="h3"/>
      <RadDataForm :source="user" :metadata="userMetaData"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="actionText" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
import general from '~/mixins/general'
const platformModule = require("tns-core-modules/platform")
export default {
  props: {
    roleTypeId: String
  },
  mixins: [general],
  data() {
    return {
      header: '',
      user: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        externalId: '',
        groupDescription: ''
      },
      userMetaData: {
        propertyAnnotations:[
          { name: 'firstName', index: 1},
          { name: 'lastName', index: 2},
          { name: 'externalId', displayName: this.$t('externalId'),
            ignore: this.roleTypeId !== 'Customer', index: 3},
          { name: 'emailAddress', editor: 'Email', index: 4,
            validators: [
              { name: "RegEx", params: {regEx: "[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}\\@[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}(\\.[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25})+.",
                errorMessage: "Please provide a valid email address."}}]},
          { name: 'groupDescription', displayName: this.$t('securityGroup'),
              valuesProvider: this.$store.getters.userGroupsDesc(), index: 5,
              editor: 'Picker', ignore: this.roleTypeId !== 'Employee' },
        ],
      },
      editedItem: null,
      actionText: this.$t('create') + this.$t(this.roleTypeId.toLowerCase()),
    };
  },
  created() {
    if (this.roleTypeId == 'Employee') {
      this.header = this.$t('passwordByEmail')
    } else {
      this.header = this.$t('enterCustInfo')
    }
  },
  methods: {
    onCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem) {
        if (!this.editedItem.firstName) {
            this.note(this.$t('firstName') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.lastName){
            this.note(this.$t('lastName') + ' ' + this.$t('cannotBeEmpty'))
        } else if (this.roleTypeId === 'Customer' && !this.editedItem.externalId){
            this.note(this.$t('externalId') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.emailAddress){
            this.note(this.$t('email') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.groupDescription && this.roleTypeId === 'Employee'){
            this.note(this.$t('groupDescription') + ' ' + this.$t('cannotBeEmpty'))
        } else {
          if (platformModule.isIOS) { // returns an index instead of value so change
            let values = this.$store.getters.userGroupsDesc()
            this.editedItem.groupDescription = 
                values[parseInt(this.editedItem.groupDescription,10)]}
          this.editedItem.locale = platformModule.device.language
          this.editedItem.roleTypeId = this.roleTypeId
          this.$backendService.createUser(this.editedItem)
          .then( result => {
            this.editedItem.verb= 'add'
            this.editedItem.partyId = result.data.partyId
            this.editedItem.image = global.noImage
            if (this.roleTypeId == 'Customer')
              this.$store.commit('customer', this.editedItem)
            if (this.roleTypeId == 'Employee')
              this.$store.commit('employee', this.editedItem)
          })}
      }  this.$modal.close()
    }
  }
}

</script>

<style>
</style>
