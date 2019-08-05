<template>
    <page>
	<StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <label :text="header" horizontalAlignment="center" class="h3"/>
        <RadDataForm :source="user", :metadata="userMetaData"
            @propertyCommitted="onCommitted"/>
        <Button class="btn btn-outline" :text="actionText" @tap="submit" />
        <Button class="btn btn-outline" :text="$t('cancel')" @tap="$modal.close()" />
	</StackLayout>
</page>
</template>

<script>
import general from '~/mixins/general'
export default {
    props: {
      roleTypeId: ''
    },
    mixins: [general],
    data() {
        return {
            header: '',
            user: {
                firstName: '',
                lastName: '',
                email: '',
                externalId: '',
                groupDescription: ''
            },
            userMetaData: {
                propertyAnnotations:[
                  { name: 'firstName'},
                  { name: 'lastName'},
                  { name: 'externalId', displayName: this.$t('externalId'),
                    hidden: this.roleTypeId !== 'Customer'},
                  { name: 'email', editor: 'Email', index: 3,
                    validators: [
                      { name: "RegEx", params: {regEx: "[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}\\@[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}(\\.[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25})+.",
                        errorMessage: "Please provide a valid email address."}}]},
                  { name: 'groupDescription', displayName: this.$t('securityGroup'),
                      valuesProvider: this.$store.getters.userGroupValues, index: 4,
                      editor: 'List', hidden: this.roleTypeId !== 'Employee'},
                ],
            },
            editedUser: {},
            actionText: this.$t('add') + ' ' + this.$t(this.roleTypeId.toLowerCase()),
        };
    },
    created() {
      this.actionText = 'ADD ' + this.roleTypeId
      if (this.roleTypeId == 'Employee') {
        this.header = this.$t('passwordByEmail')
      } else {
        this.header = this.$t('enterCustInfo')
      }
    },
    methods: {
        onCommitted(data) {
            this.editedUser = JSON.parse(data.object.editedObject)
        },
        submit() {
            if (!this.editedUser.firstName)
              this.note(this.$t('firstName') + ' ' + this.$t('cannotBeEmpty'))
            else if (!this.editedUser.lastName)
              this.note(this.$t('lastName') + ' ' + this.$t('cannotBeEmpty'))
            else if (this.roleTypeId === 'Customer' && !this.editedUser.externalId)
              this.note(this.$t('externalId') + ' ' + this.$t('cannotBeEmpty'))
            else if (!this.editedUser.email)
              this.note(this.$t('email') + ' ' + this.$t('cannotBeEmpty'))
            else {
                const platformModule = require("tns-core-modules/platform");
                this.editedUser.locale = platformModule.device.language
                this.editedUser.roleTypeId = this.roleTypeId
                this.$backendService.createUser(this.editedUser)
                .then( result => {
                  this.editedUser.partyId = result.data.partyId
                  this.editedUser.image = global.noImage
                  this.$modal.close(this.editedUser)
                })}
        }
    }
}

</script>

<style>
</style>
