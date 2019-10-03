<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
  <StackLayout class="p-20" backgroundColor="white" paddingTop="40"
        width="90%">
    <label :text="$t('changePasswordFor')" class="h2" textWrap="true"
          horizontalAlignment="center"/>
    <label :text="fullName" class="h2" textWrap="true"
          horizontalAlignment="center"/>
    <RadDataForm :source="user" :metadata="userMetaData"
        @propertyCommitted="onCommitted"/>
    <GridLayout columns="*,*" rows="auto">
      <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
      <Button class="button" :text="$t('change')" @tap="submit" col="1"/>
    </GridLayout>
  </StackLayout></ModalStack>
  </page>
</template>

<script>
import general from '~/mixins/general'
export default {
  name: 'PasswordUpdate',
  mixins: [general],
  props: { 
    fullName: String,
    username: String,
    oldPassword: '',
  },
  data() {
    return {
      user: {
        oldPassword: this.oldPassword,
        newPassword: '',
        passwordVerify: '',
      },
      userMetaData: {
        propertyAnnotations:[
          { name: 'oldPassword', index: 0, editor: 'Password',
            ignore: this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN' || this.oldPassword ? true : false},
          { name: 'newPassword', index: 1, editor: 'Password'},
          { name: 'passwordVerify', index: 2 , editor: 'Password'},
        ],
      },
      editedItem: null,
    };
  },
  methods: {
    onCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem) {
        if (this.editedItem.newPassword !== this.editedItem.passwordVerify)
          this.note(this.$t('NewPasswordsAreNotTheSame'))
        else if (!this.editedItem.oldPassword && this.$store.getters.currentEmployeeUserGroupId!=='GROWERP_M_ADMIN')
            this.note(this.$t('oldPasswordIsRequired'))
        else if (!this.editedItem.newPassword)
            this.note(this.$t('newPasswordIsRequired'))
        else if (!this.editedItem.passwordVerify)
            this.note(this.$t('passwordVerifyIsRequired'))
        else {
          this.editedItem.username = this.username
          this.$backendService.updatePassword(this.editedItem)
          .then(() => {
              this.note(this.$t('updatePasswordSuccessful'))
              this.$modal.close()})
          .catch( error => {
              if (error.response.data.errors.indexOf("Found issues with password") !== -1) {
                this.note(this.$t('passwordRequirement'))
              } else {
                this.note(this.$t('regError') + this.$backendService.getErrorMessage(error))
              }
          })
        }
      }
    }
  }
}

</script>

<style>
</style>
