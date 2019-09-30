<template lang="html">
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :save="true" :back="true"
          :onActionTap="onSaveTap"
          :header="this.$t(this.item.roleTypeId.toLowerCase()) + ' ' + 
              this.$t('myInfoLong')"/>
    </ActionBar>
    <StackLayout>
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image ref="itemForm" :src="itemImage" width="100" height="100"
            col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"
            @tap="selectPicture('user', item.partyId)" col=2 row="0"/>
        <Button class="button" :text="$t('useCamera')"
            @tap="takePicture('user', item.partyId)" col="2" row="1"/>
      </GridLayout>
      <RadDataForm ref="itemForm" :source="item"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Button class="button" :text="$t('updatePassword')" @tap="onPasswordTap"/>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import passwordUpdate from './modalPages/PasswordUpdate'
const platformModule = require("tns-core-modules/platform");

export default {
  name: 'MyInfo',
  mixins: [ sideDrawer, imageSelector, general ],
  data () {
    return {
      userGroups: this.$store.getters.userGroupsDesc(false),
      item: Object.assign({},this.$store.getters.currentEmployee),
      itemImage: '',
      editedItem: null,
      itemMeta: {
        propertyAnnotations:[
            { name: 'partyId', ignore: true},
            { name: 'roleTypeId', ignore: true},
            { name: 'externalId', ignore: true},
            { name: 'firstName', displayName: this.$t('firstName'), index: 0},
            { name: 'lastName', displayName: this.$t('lastName'), index: 1},
            { name: 'username', displayName: this.$t('loginName'),
                index: 2, ignore: this.roleTypeId==='Customer'},
            { name: 'emailAddress',  displayName: this.$t('email'),
                editor: "Email", index: 4,},
            { name: 'image', ignore: true},
            { name: 'userId', ignore: true},
            { name: 'locale', ignore: true},
            { name: 'userGroupId', ignore: true},
            { name: 'groupDescription', displayName: this.$t('userGroup'), index: 5,
                editor: 'Picker', valuesProvider: this.$store.getters.userGroupsDesc(false),
                readOnly: this.$store.getters.currentEmployeeUserGroupId != 'GROWERP_M_ADMIN'},
        ],
      },
    }
  },
  created() {
    this.$backendService.downloadImage('medium', 'user', this.item.partyId)
    .then(result => {this.itemImage = result.data.imageFile})
    if (platformModule.isIOS) { // returns an index instead of value so change
      this.itemData.groupDescription = this.userGroups.findIndex(
          o => o === this.itemData.description)}
  },
  methods: {
    onItemCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
    },
    onPasswordTap() {
      this.$showModal(passwordUpdate, {props: {username: this.item.username,
            fullname: this.item.firstName + ' ' + this.item.lastName}})
    },
    onSaveTap() {
      if (this.editedItem) {
        if (!this.editedItem.firstName) {
            this.note(this.$t('firstName') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.lastName){
            this.note(this.$t('lastName') + ' ' + this.$t('cannotBeEmpty'))
        } else if (this.item.roleTypeId === 'Customer' && !this.editedItem.externalId){
            this.note(this.$t('externalId') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.emailAddress){
            this.note(this.$t('email') + ' ' + this.$t('cannotBeEmpty'))
        } else if (!this.editedItem.groupDescription && this.item.roleTypeId != 'Customer'){
            this.note(this.$t('groupDescription') + ' ' + this.$t('cannotBeEmpty'))
        } else {
          if (platformModule.isIOS) { // returns an index instead of value so change
            this.editedItem.groupDescription = 
                this.userGroups[parseInt(this.editedItem.groupDescription,10)]}
          this.$backendService.updateUser(this.editedItem)
          this.editedItem.verb = 'update'
          this.$store.commit('employee', this.editedItem)
          this.hideKeyboard()
        }
      }
    this.$navigateBack()
    }
  }
}
</script>

<style lang="css">
</style>
