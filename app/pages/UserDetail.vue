<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTap" :save="true" :back="true"
          :onActionTap="onSaveTap"
          :headerNoI18n="$t(item.roleTypeId.toLowerCase()) + ' ' + 
              this.$t('detailedInfo')"/>
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
      <RadDataForm ref="itemForm" :source="itemData" height="55%"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Button class="button" :text="$t('updatePassword')" @tap="onPasswordTap"
        width="50%" row="1"  :visibility=
          "this.$store.getters.currentEmployeeUserGroupId ===
          'GROWERP_M_ADMIN' &amp;&amp; !this.editedItem?'visible':'hidden'"/>
    </StackLayout>
  </Page>
</template>

<script>
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'
import passwordUpdate from './modalPages/PasswordUpdate'
import { isIOS, isAndroid } from 'tns-core-modules/platform'
const frameModule = require("tns-core-modules/ui/frame");
export default {
  name: 'UserDetail',
  mixins: [ imageSelector, general ],
  props: {
    item: Object,
    myInfo: {type: Boolean, default: false},
  },
  data() {
    return {
      userGroups: this.$store.getters.userGroupsDesc(false),
      editedItem: null,
      itemData: Object.assign({}, this.item),
      itemMeta: {
        propertyAnnotations:[
          { name: 'partyId', ignore: true},
          { name: 'locale', ignore: true},
          { name: 'roleTypeId', ignore: true},
          { name: 'firstName', required: true, index: 0},
          { name: 'lastName', required: true, index: 1},
          { name: 'username', displayName: this.$t('loginName'),
              required: true, index: 2, 
              ignore: this.item.roleTypeId==='Customer'},
          { name: 'emailAddress', displayName: this.$t('email'), required: true,
              editor: "Email", index: 4},
          { name: 'image', ignore: true},
          { name: 'externalId', 
              ignore: this.item.roleTypeId != 'Customer', index: 5},
          { name: 'userId', ignore: true},
          { name: 'userGroupId', ignore: true},
          { name: 'groupDescription', index: 6, displayName: this.$t('userGroup'),
              valuesProvider: this.$store.getters.userGroupsDesc(false),
              ignore: this.item.roleTypeId == 'Customer',
              editor: 'Picker', 
              readOnly: this.$store.getters.currentEmployeeUserGroupId != 
                'GROWERP_M_ADMIN'},
        ],
      },
    }
  },
  created() {
    if (!this.itemImage.length) {
      this.$backendService.downloadImage('medium', 'user', this.item.partyId)
      .then(result => { this.itemImage = result.data.imageFile})}
    if (isIOS) { // returns an index instead of value so change
      this.itemData.groupDescription = this.userGroups.findIndex(
          o => o === this.itemData.description)}
  },
  methods: {
    onHeaderTap() {
      if (this.myInfo) frameModule.topmost().goBack()
      else if (this.item.roleTypeId === "Employee")
          this.$navigateTo(this.$routes.Organization,{props:{startTab: 0}})
      else if (this.item.roleTypeId === "Customer")
          this.$navigateTo(this.$routes.Organization,{props:{startTab: 1}})
    },
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
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
          if (isIOS) { // returns an index instead of value so change
            this.editedItem.groupDescription = 
                this.userGroups[parseInt(this.editedItem.groupDescription,10)]}
          this.$backendService.updateUser(this.editedItem)
          this.editedItem.verb = 'update'
          if (this.editedItem.roleTypeId == 'Customer')
            this.$store.commit('customer', this.editedItem)
          if (this.editedItem.roleTypeId == 'Employee')
            this.$store.commit('employee', this.editedItem)
          this.hideKeyboard()
        }
      }
      this.$navigateBack()
    },
    onPasswordTap() {
      this.$showModal(passwordUpdate, {props: {username: this.item.username,
            fullName: this.item.firstName + ' ' + this.item.lastName }})
    }
  }
}
</script>
