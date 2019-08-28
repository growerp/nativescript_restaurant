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
                  <RadDataForm ref="itemForm" :source="itemComp"
                      :metadata="itemMetaComp" @propertyCommitted="onItemCommitted"/>
              </StackLayout>
            </TabViewItem>

            <TabViewItem :title="$t('employee') + ' max:' + subscribedUsers()">
                <StackLayout>
                    <RadListView ref="listView"
                          for="user in users"
                          @itemTap="onItemTap" @loaded="onLoadedUsers">
                        <v-template>
                            <GridLayout columns="50, *, auto" rows="*" class="item"
                                  paddingRight="5" paddingLeft="5">
                                <Image :src="user.image" col="0" class="thumbnail"/>
                                <StackLayout col="1" paddingLeft="10">
                                    <label :text="user.firstName + ' ' + user.lastName"
                                      class="h2"/>
                                    <label :text="user.email" class="p"/>
                                </StackLayout>
                                <label :text="user.groupDescription" col="2"/>
                            </GridLayout>
                        </v-template>
                    </RadListView>
                </StackLayout>
            </TabViewItem>

            <TabViewItem :title="$t('customer')">
                <StackLayout>
                    <RadListView ref="listView"
                        for="user in customers"
                        @itemTap="onItemTap" @loaded="onLoadedCustomers">
                        <v-template>
                            <GridLayout columns="50, *, auto" rows="*" class="item"
                                paddingRight="5" paddingLeft="5">
                                <Image :src="user.image"
                                    col="0" class="thumbnail"/>
                                <StackLayout col="1" paddingLeft="10">
                                    <label :text="user.firstName + ' ' + user.lastName"
                                        class="h2"/>
                                    <label :text="user.email" class="p"/>
                                </StackLayout>
                                <StackLayout col="2">
                                  <label :text="user.externalId"/>
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
                          @tap="selectPicture('user', item.partyId)" col=2 row="0"/>
                      <Button class="button" :text="$t('useCamera')"
                          @tap="takePicture('user', item.partyId)" col="2" row="1"/>
                  </GridLayout>
                  <RadDataForm ref="itemForm" :source="item"
                      :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
                  <Button class="button" :text="$t('updatePassword')" @tap="onPasswordTap"/>
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
import passwordUpdate from './modalPages/PasswordUpdate'
import { stringify } from 'querystring';
var platformModule = require("tns-core-modules/platform");

export default {
    name: 'organization',
    mixins: [ sideDrawer, imageSelector, general ],
    props: {
        startTab: Number
    },
    data () {
        return {
            text: this.$t('companyEmplCust'),
            currentTab: 0,
            users: [],
            customers: [],
            item: {},
            itemImage: '',
            editedItem: {},
            itemMeta: {
                propertyAnnotations:[
                    { name: 'partyId', hidden: true, ignore: true},
                    { name: 'externalId', hidden: true, ignore: true},
                    { name: 'firstName', required: true, displayName: this.$t('firstName'), index: 0},
                    { name: 'lastName', required: true, displayName: this.$t('lastName'), index: 1},
                    { name: 'username', displayName: this.$t('loginName'),
                        required: true, index: 2, hidden: this.roleTypeId==='Customer', ignore: this.roleTypeId==='Customer'},
                    { name: 'email', required: true, displayName: this.$t('emailAddress'),
                        editor: "Email", index: 4},
                    { name: 'image', hidden: true, ignore: true},
                    { name: 'userId', hidden: true, ignore: true},
                    { name: 'locale', hidden: true, ignore: true},
                    { name: 'userGroupId', hidden: true, ignore: true},
                    { name: 'groupDescription', displayName: this.$t('userGroup'),
                        index: 5, valuesProvider: this.$store.getters.userGroupValues,
                        editor: 'Picker', }, //readOnly: this.item.groupDescription != 'Admin'},
                    { name: 'newPassword', index: 7},
                    { name: 'newPasswordVerify', index: 8},
                  ],
            },
            itemComp: {},
            itemMetaComp: {
                propertyAnnotations:[
                  { name: 'contactMechId', hidden: true, ignore: true},
                  { name: 'partyId', hidden: true, ignore: true},
                    { name: 'name', displayName: "Restaurant Name",
                        required: true, index: 0},
                    { name: 'email', displayName: 'Email address', required: true,
                            editor: "Email", index: 1},
                    { name: 'currency', displayName: 'Currency (enter a request to change)',
                        readOnly: true, index: 2}]
            },
            save: false,
            plus: false,
        }
    },
    created() {
      this.currentTab = this.startTab
      if (!this.item.length) {
        this.$backendService.getUserList('Employee','0',true).then( result => {
          this.item = result.data.users[0]
          this.$backendService.downloadImage('medium', 'user', this.item.partyId)
          .then(result => {this.itemImage = result.data.imageFile})})
      }
      this.$backendService.getCompany().then(result => {
          this.itemComp = result.data.company
          this.$backendService.downloadImage('medium', 'company', this.itemComp.partyId).then(result => {
              this.itemImage = result.data.imageFile })
      })
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
        onLoadedUsers() {
          if (!this.users.length) {
            this.$backendService.getUserList('Employee')
            .then (result => { 
              this.users = result.data.users
              console.log('====users: ' + JSON(stringify( this.users)))
          })}
        },
        onLoadedCustomers() {
          if (!this.customers.length) {
            this.$backendService.getUserList('Customer')
            .then (result => { this.customers = result.data.users})}
        },
        onItemTap (args) {
          if (this.currentTab === 1) { // employees
            this.$navigateTo(this.$routes.UserDetail,
              { props: {  list: this.users, index: args.index,
                          roleTypeId: 'Employee'}})}
          if (this.currentTab === 2) { //customer
            this.$navigateTo(this.$routes.UserDetail,
              { props: {  list: this.customers, index: args.index,
                          roleTypeId: 'Customer'}})}
        },
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onActionTap() {
            switch(this.currentTab) {
              case 3: // logged in user
                if (this.editedItem && this.editedItem.partyId) {
                  this.$backendService.updateUser(this.editedItem)
                  this.note(this.$t('informationIsUpdated'))
                  this.$store.commit('username', this.editedItem.username)
                  this.hideKeyboard()}
                break
              case 0: // company
              if (this.editedItem && this.editedItem.partyId) {
                  this.$backendService.updateCompany(this.editedItem)
                  this.note(this.$t('informationIsUpdated'))
                  this.hideKeyboard()}
                break
              case 1: // employees
                if (this.users.length >= this.subscribedUsers()) {
                  this.note(this.$t('maxEmployeesReached'))
                  this.$navigateTo(this.$routes.Upgrade)
                } else {
                  this.$showModal(UserAdd, {props: { roleTypeId: 'Employee'}})
                  .then( result => {
                    if (result) {
                      let inserted = false
                      for (let i=0; i < this.users.length; i++) {
                        if (this.users[i].partyId.toUpperCase() > result.partyId.toUpperCase()) {
                          this.users.splice(i,0,result); inserted = true;break }}
                          if(!inserted) this.users.push(result);
                  }})
                }
                break
              case 2: // customer
                this.$showModal(UserAdd, {props: { roleTypeId: 'Customer'}})
                .then( result => {
                  if(result) {
                    let inserted = false
                    for (let i=0; i < this.customers.length; i++) {
                      if (this.customers[i].partyId.toUpperCase() > result.partyId.toUpperCase()) {
                        this.customers.splice(i,0,result); inserted = true;break }}
                    if(!inserted) this.customers.push(result);
                }})
                break
            }
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
