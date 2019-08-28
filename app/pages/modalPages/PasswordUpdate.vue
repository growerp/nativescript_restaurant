<template>
    <page>
	    <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
         <label :text="header"/>
         <RadDataForm :source="user", :metadata="userMetaData"
            @propertyCommitted="onCommitted"/>
         <Button class="button" :text="actionText" @tap="submit" />
         <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
	    </StackLayout>
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
            header: this.$t('changePasswordFor') + ' ' + this.fullName,
            user: {
                oldPassword: this.oldPassword,
                newPassword: '',
                passwordVerify: '',
            },
            userMetaData: {
                propertyAnnotations:[
                  { name: 'oldPassword', index: 0, editor: 'Password',
                    ignore: this.$store.getters.user.userGroupId === 'GROWERP_M_ADMIN' || this.oldPassword ? true : false},
                  { name: 'newPassword', index: 1, editor: 'Password'},
                  { name: 'passwordVerify', index: 2 , editor: 'Password'},
                ],
            },
            editedItem: {},
            actionText: this.$t('change'),
        };
    },
    methods: {
        onCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        submit() {
              if (this.editedItem.newPassword === this.editedItem.passwordVerify) {
                if (!this.editedItem.oldPassword && this.$store.getters.user.userGroupId!=='GROWERP_M_ADMIN') {
                  this.note(this.$t('oldPasswordIsRequired')) }
                this.editedItem.username = this.username
                this.$backendService.updatePassword(this.editedItem)
                .then(() => {
                    this.note(this.$t('updatePasswordSuccessful'))
                    this.$modal.close()})
                .catch( error => {
                    if (error.response.data.errors.indexOf("Found issues with password") !== -1) {
                      alert(this.$t('passwordRequirement'))
                    } else {
                      alert(this.$t('regError') + this.$backendService.getErrorMessage(error))
                    }
                })

              } else {
                this.note(this.$t('NewPasswordsAreNotTheSame'))}
        }
    }
}

</script>

<style>
</style>
