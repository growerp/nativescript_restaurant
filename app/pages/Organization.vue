<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="save" :plus="plus" 
        :onActionTap="onActionTap" :openDrawer="openDrawer"
        header="companyEmplCust"/>
    </ActionBar>

    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange">
      <TabViewItem :title="$t('company')">
        <GridLayout rows="auto, *, 50" class="p-10">
          <GridLayout width="100%" columns="100,30,*" rows="50,50" row="0">
            <Image ref="itemForm" :src="itemImage" width="100" height="100"
                col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"
                @tap="selectPicture('company', itemComp.partyId)" col=2 row="0"/>
            <Button class="button" :text="$t('useCamera')"
                @tap="takePicture('company', itemComp.partyId)" col="2" row="1"/>
          </GridLayout>
          <RadDataForm :source="itemComp" row="1"
              :metadata="itemMetaComp" @propertyCommitted="onItemCommitted"/>
        </GridLayout>
      </TabViewItem>

      <TabViewItem :title="$t('employee') + ' max:' + subscribedUsers()">
        <GridLayout rows="*, 50" class="p-10">
          <RadListView for="item in employees" row="0">
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto" rows="*">
                  <Image src="~/assets/images/search.png"
                    width="30" col="0" @tap="searchTap"/>
                  <StackLayout col="1">
                    <label :text="$t('employee') + ' ' + $t('name')"
                        class="h3"/>
                    <label :text="$t('email')"
                        class="h3"/>
                  </StackLayout>
                  <label :text="$t('userGroup')" col="2" class="h3"/>
                </GridLayout>
                <StackLayout class="hr-dark m-5"/>
              </StackLayout>
            </v-template>
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="item"
                    @tap="onItemTap(item)"
                    @longPress="onDeleteTap(item)">
                <Image :src="item.image" col="0" class="thumbnail"/>
                  <StackLayout col="1" class="m-l-10">
                    <label :text="item.firstName + ' ' + item.lastName"
                      class="h2"/>
                    <label :text="item.emailAddress" class="h3"/>
                  </StackLayout>
                <label :text="item.groupDescription" col="2"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </GridLayout>
      </TabViewItem>

      <TabViewItem :title="$t('customer')">
        <GridLayout rows="*, 50" class="p-10">
          <RadListView for="item in customers" row="0">
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto" rows="*">
                  <Image src="~/assets/images/search.png" 
                    width="30" col="0" @tap="searchTap"/>
                  <StackLayout col="1">
                    <label :text="$t('customer') + ' ' + $t('name')"
                        class="h3"/>
                    <label :text="$t('email')"
                        class="h3"/>
                  </StackLayout>
                  <label :text="$t('externalId')" col="2" class="h3"/>
                </GridLayout>
                <StackLayout class="hr-dark m-5"/>
              </StackLayout>
            </v-template>
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="item"
                  @Tap="onItemTap(item)"
                    @longPress="onDeleteTap(item)">
                <Image :src="item.image"
                    col="0" class="thumbnail"/>
                <StackLayout col="1" class="m-l-10">
                  <label :text="item.firstName + ' ' + item.lastName"
                      class="h2"/>
                  <label :text="item.emailAddress" class="h3"/>
                </StackLayout>
                <StackLayout col="2">
                  <label :text="item.externalId"/>
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
        </GridLayout>
      </TabViewItem>

      <TabViewItem :title="$t('myInformation')">
        <GridLayout rows="auto, *, auto, 50" class="p-10">
          <GridLayout width="100%" columns="100,30,*" rows="50,50" row="0">
            <Image ref="itemForm" :src="itemImage" width="100" height="100"
                col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"
                @tap="selectPicture('user', item.partyId)" col=2 row="0"/>
            <Button class="button" :text="$t('useCamera')"
                @tap="takePicture('user', item.partyId)" col="2" row="1"/>
          </GridLayout>
          <RadDataForm :source="item" row="1"
              :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
          <Button class="button" :text="$t('updatePassword')" 
              @tap="onPasswordTap" row="2"/>
        </GridLayout>
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
import Search from './modalPages/Search'
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
      userGroups: this.$store.getters.userGroupsDesc(false),
      employees: this.$store.getters.employees,
      customers: this.$store.getters.customers,
      item: Object.assign({},this.$store.getters.currentEmployee),
      editedItem: null,
      itemMeta: {
        propertyAnnotations:[
          { name: 'partyId', ignore: true},
          { name: 'roleTypeId', ignore: true},
          { name: 'externalId', ignore: true},
          { name: 'firstName', required: true, displayName: this.$t('firstName'),
              index: 0},
          { name: 'lastName', required: true, displayName: this.$t('lastName'),
              index: 1},
          { name: 'username', displayName: this.$t('loginName'),
              required: true, index: 2, ignore: this.roleTypeId==='Customer'},
          { name: 'emailAddress', required: true, displayName: this.$t('email'),
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
      save: false,
      plus: false
    }
  },
  created() {
    this.currentTab = this.startTab
    this.$backendService.downloadImage('medium', 'user', this.item.partyId)
      .then(result => {this.itemImage = result.data.imageFile})
    this.$backendService.downloadImage('medium', 'company', this.itemComp.partyId)
      .then(result => {this.itemImage = result.data.imageFile })
    if (platformModule.isIOS) { // returns an index instead of value so change
      this.item.groupDescription = this.userGroups.findIndex(
          o => o === this.item.groupDescription)}
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
        this.$navigateTo(this.$routes.UserDetail,
          { props: {  item: item}})
    },
    searchTap() {
      if (this.currentTab == 1) {
        this.$showModal(Search,{ props: {
            message: 'employeeSearch', item: {name: ''}}
        })
        .then (data => {
          if (data) 
            this.employees = this.$store.getters.employeesSearchName(data.name)
        })}
      if (this.currentTab == 2) {
        this.$showModal(Search,{ props: {
            message: 'customerSearch', item: {name: ''}}
        })
        .then (data => {
          if (data) 
          console.log("searching with" + JSON.stringify(data))
            this.customers = this.$store.getters.customersSearchName(data.name)
        })}
    },
    onActionTap() {
      switch(this.currentTab) {
        case 3: // logged in user
          if (this.editedItem) {
            if (!this.editedItem.firstName) {
                this.note(this.$t('firstName') + ' ' + this.$t('cannotBeEmpty'))
            } else if (!this.editedItem.lastName){
                this.note(this.$t('lastName') + ' ' + this.$t('cannotBeEmpty'))
            } else if (!this.editedItem.emailAddress){
                this.note(this.$t('email') + ' ' + this.$t('cannotBeEmpty'))
            } else if (!this.editedItem.groupDescription) {
                this.note(this.$t('groupDescription') + ' ' + this.$t('cannotBeEmpty'))
            } else {
              if (platformModule.isIOS) { // returns an index instead of value so change
                this.editedItem.groupDescription = 
                    this.userGroups[parseInt(this.editedItem.groupDescription,10)]}
              this.$backendService.updateUser(this.editedItem)
              this.note(this.$t('informationIsUpdated'))
              this.editedItem.verb = "update"
              this.$store.commit('employee', this.editedItem)
              this.hideKeyboard()}
          }
          break
        case 0: // company
          if (this.editedItem) {
            this.$backendService.updateCompany(this.editedItem)
            this.note(this.$t('informationIsUpdated'))
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
          if(this.currentTab == 2)
            this.$store.commit('customer', 
              {verb: 'delete', partyId: item.partyId})
          if(this.currentTab == 1)
            this.$store.commit('employee', 
              {verb: 'delete', partyId: item.partyId})
        }
      })
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
