<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="save" :plus="plus" 
        :onActionTap="onActionTap" :openDrawer="openDrawer" header="companyEmplCust"/>
    </ActionBar>

    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">
      <TabViewItem :title="$t('company')">
        <StackLayout>
          <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image ref="itemForm" :src="itemImage" width="100" height="100"
                col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"
                @tap="selectPicture('company', item.partyId)" col=2 row="0"/>
            <Button class="button" :text="$t('useCamera')"
                @tap="takePicture('company', item.partyId)" col="2" row="1"/>
          </GridLayout>
          <RadDataForm :source="itemComp"
              :metadata="itemMetaComp" @propertyCommitted="onItemCommitted"/>
        </StackLayout>
      </TabViewItem>

      <TabViewItem :title="$t('employee') + ' max:' + subscribedUsers()">
        <StackLayout>
          <RadListView for="item in employees">
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="item"
                    paddingRight="5" paddingLeft="5"  @tap="onItemTap(item)"
                    @longPress="onDeleteTap(item)">
                <Image :src="item.image" col="0" class="thumbnail"/>
                <StackLayout col="1" paddingLeft="10">
                    <label :text="item.firstName + ' ' + item.lastName"
                      class="h2"/>
                    <label :text="item.email" class="p"/>
                </StackLayout>
                <label :text="item.groupDescription" col="2"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </StackLayout>
      </TabViewItem>

      <TabViewItem :title="$t('customer')">
        <StackLayout>
          <RadListView for="item in customers">
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="item"
                  paddingRight="5" paddingLeft="5"  @Tap="onItemTap(item)"
                    @longPress="OnDeleteTap(item)">
                <Image :src="item.image"
                    col="0" class="thumbnail"/>
                <StackLayout col="1" paddingLeft="10">
                    <label :text="item.firstName + ' ' + item.lastName"
                        class="h2"/>
                    <label :text="item.email" class="p"/>
                </StackLayout>
                <StackLayout col="2">
                  <label :text="item.externalId"/>
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
        </StackLayout>
      </TabViewItem>

      <TabViewItem :title="$t('myInformation')">
        <StackLayout>
          <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image ref="itemForm" :src="itemImage" width="100" height="100"
                col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"
                @tap="selectPicture('item', item.partyId)" col=2 row="0"/>
            <Button class="button" :text="$t('useCamera')"
                @tap="takePicture('item', item.partyId)" col="2" row="1"/>
          </GridLayout>
          <RadDataForm :source="item"
              :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
          <Button class="button" :text="$t('updatePassword')" 
              @tap="onPasswordTap"/>
        </StackLayout>
      </TabViewItem>
    </TabView>
   </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import UserAdd from './modalPages/UserAdd'
import Confirm from './modalPages/Confirm'
import passwordUpdate from './modalPages/PasswordUpdate'
const platformModule = require("tns-core-modules/platform")
export default {
  name: 'organization',
  mixins: [ sideDrawer, imageSelector, general ],
  props: {
    startTab: Number
  },
  data () {
    return {
      currentTab: 0,
      employees: this.$store.getters.employees,
      customers: this.$store.getters.customers,
      item: Object.assign({},this.$store.getters.currentEmployee),
      editedItem: null,
      itemMeta: {
        propertyAnnotations:[
          { name: 'partyId', ignore: true},
          { name: 'externalId', ignore: true},
          { name: 'firstName', required: true, displayName: this.$t('firstName'), index: 0},
          { name: 'lastName', required: true, displayName: this.$t('lastName'), index: 1},
          { name: 'username', displayName: this.$t('loginName'),
              required: true, index: 2, ignore: this.roleTypeId==='Customer'},
          { name: 'email', required: true, displayName: this.$t('email'),
              editor: "Email", index: 4},
          { name: 'image', ignore: true},
          { name: 'userId', ignore: true},
          { name: 'locale', ignore: true},
          { name: 'userGroupId', ignore: true},
          { name: 'groupDescription', displayName: this.$t('userGroup'),
              index: 5, valuesProvider: this.$store.getters.userGroupsDesc(false),
              editor: 'Picker', }, //readOnly: this.item.groupDescription != 'Admin'},
          { name: 'newPassword', index: 7},
          { name: 'newPasswordVerify', index: 8},
        ],
      },
      itemComp: Object.assign({},this.$store.getters.company),
      itemMetaComp: {
        propertyAnnotations:[
          { name: 'contactMechId', ignore: true},
          { name: 'partyId', ignore: true},
          { name: 'organizationName', displayName: "Restaurant Name",
              required: true, index: 0},
          { name: 'emailAddress', displayName: 'Email address',
              editor: "Email", index: 1},
          { name: 'currencyId', readOnly: true, index: 2,
              displayName: 'Currency (enter a request to change)'},
        ]
      },
    }
  },
  created() {
    this.currentTab = this.startTab
    if (!this.item.length) {
      this.$backendService.downloadImage('medium', 'user', this.item.partyId)
        .then(result => {this.itemImage = result.data.imageFile})
    }
    this.$backendService.downloadImage('medium', 'company', this.itemComp.partyId)
    .then(result => {
          this.itemImage = result.data.imageFile })
    if (platformModule.isIOS) { // returns an index instead of value so change
      this.item.description = this.userGroups.findIndex(
          o => o === this.item.description)}
  },
  methods: {
    tabChange(args) {
      this.currentTab = args.value
      switch(this.currentTab) {
        case 3:
        case 0:
          this.save = true
          this.plus = false
          break
        case 1:
        case 2:
          this.plus = true
          this.save = false
          break
      }
    },
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    onItemTap (item) {
      console.log("=======item: " + JSON.stringify(item))
      if (this.currentTab === 1) { // employees
        this.$navigateTo(this.$routes.UserDetail,
          { props: {  item: item, roleTypeId: 'Employee'}})}
      if (this.currentTab === 2) { //customer
        this.$navigateTo(this.$routes.UserDetail,
          { props: {  item: item, roleTypeId: 'Customer'}})}
    },
    onActionTap() {
      switch(this.currentTab) {
        case 3: // logged in user
          if (this.editedItem) {
            this.$backendService.updateUser(this.editedItem)
            this.note(this.$t('informationIsUpdated'))
            this.editedItem.verb = "update"
            this.$store.commit('employee', this.editedItem)
            this.hideKeyboard()}
          break
        case 0: // company
          if (this.editedItem) {
            this.$backendService.updateCompany(this.editedItem)
            this.note(this.$t('informationIsUpdated'))
            this.editedItem.verb = 'update'
            this.$store.commit('company', this.editedItem)
            this.hideKeyboard()}
          break
        case 1: // employees
          if (this.employees.length >= this.subscribedUsers()) {
            this.note(this.$t('maxEmployeesReached'))
            this.$navigateTo(this.$routes.Upgrade)
          } else
            this.$showModal(UserAdd, {props: { roleTypeId: 'Employee'}})
          break
        case 2: // customer
          this.$showModal(UserAdd, {props: { roleTypeId: 'Customer'}})
          break
      }
    },
    onDeleteTap(item) {
      this.$showModal(Confirm,{ props: {
          message: this.$t('confirmDeletionMsg') + item.roleTypeId + ' ' +
              item.firstName + ' ' + item.lastName + "?" }
      }).then (data => {
        if (data) {
          this.$backendService.deleteUser(item.partyId)
          this.editedItem.verb = 'delete'
          this.$store.commit(eval(this.roleTypeId.toLowerCase), 
              { partyId: item.partyId})
      }})
    },
    onPasswordTap() {
      this.$showModal(passwordUpdate, {props: {username: this.item.username,
              fullname: this.item.firstName + ' ' + this.item.lastName}})
      }
  }
}
</script>

<style lang="css">
</style>
