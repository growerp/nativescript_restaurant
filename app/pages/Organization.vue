<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :save="save" :plus="plus" 
        :onActionTap="onActionTap" :back=true
        header="companyEmplCust"/>
    </ActionBar>

    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange" class="tabView"
              style="tabTextColor: lightGreen;selectedTabTextColor: green;">
    <TabViewItem :title="$t('employees')">
       <GridLayout rows="*" class="p-10">
          <RadListView for="item in employees" row="0">
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto" rows="*" background="#00CAAB">
                  <Image src="~/assets/images/search.png"
                    width="30" col="0" @tap="searchTap"/>
                  <StackLayout col="1">
                    <label :text="$t('employee') + ' ' + $t('name')" class="h3"/>
                    <label :text="$t('email')" class="h4"/>
                  </StackLayout>
                  <label :text="$t('userGroup')" col="2" class="h4"/>
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
        <GridLayout rows="*" class="p-10">
          <RadListView for="item in customers" row="0">
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto" rows="*" background="#00CAAB">
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
    </TabView>
   </Page>
</template>

<script>

import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import UserAdd from './modalPages/UserAdd'
import Confirm from './modalPages/Confirm'
import Search from './modalPages/Search'
import passwordUpdate from './modalPages/PasswordUpdate'
import { isIOS } from 'tns-core-modules/platform';
export default {
  name: 'organization',
  mixins: [  imageSelector, general ],
  props: {
    startTab: Number
  },
  data () {
    return {
      currentTab: 0,
      userGroups: this.$store.getters.userGroupsDesc(false),
      employees: this.$store.getters.employees,
      customers: this.$store.getters.customers,
      editedItem: null,
      save: false,
      plus: false
    }
  },
  created() {
    this.currentTab = this.startTab
    console.log("first empl from store: " +JSON.stringify(this.employees))
  },
  methods: {
    tabChange(args) {
      this.currentTab = args.value
      switch(this.currentTab) {
        case 0:
        case 1:
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
      if (this.currentTab == 0) {
        this.$showModal(Search,{ props: {
            message: 'employeeSearch', item: {name: ''}}
        })
        .then (data => {
          if (data) 
            this.employees = this.$store.getters.employeesSearchName(data.name)
        })}
      if (this.currentTab == 1) {
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
        case 0: // employees
  //        if (this.employees.length >= this.subscribedUsers()) {
  //          this.note(this.$t('maxEmployeesReached'))
  //          this.$navigateTo(this.$routes.Upgrade)
  //        } else
            this.$showModal(UserAdd, {props: { roleTypeId: 'Employee'}})
          break
        case 1: // customer
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
          if(this.currentTab == 1)
            this.$store.commit('customer', 
              {verb: 'delete', partyId: item.partyId})
          if(this.currentTab == 0)
            this.$store.commit('employee', 
              {verb: 'delete', partyId: item.partyId})
        }
      })
    },
  }
}
</script>

<style lang="css">
</style>
