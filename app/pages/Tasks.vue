<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
        <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)"
            col="1" horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          <Label class="title" :text="$t('tasksMeOthers')"/>
        </StackLayout>
        <Label @tap="onAddTap" :text="$t('add')" col="2"/>
      </GridLayout>
    </ActionBar>
    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">
            <TabViewItem :title="$t('mytasks')">
              <RadListView ref="myTaskListView" for="item in myItemList"
                  @itemTap="onMyItemTap" @loaded="onMyLoaded">
                <v-template>
                  <GridLayout columns="50, *, auto" rows="*" class="item"
                      paddingRight="5" paddingLeft="5">
                    <Image :src="item.image"  col="0" class="thumbnail"/>
                    <StackLayout col="1">
                      <label :text="item.workEffortName" class="h2"/>
                      <label :text="item.fullName" class="p"/>
                    </StackLayout>
                    <StackLayout col="2">
                      <label :text="item.priority" class="h2"/>
                      <label :text="$t(item.statusId)" class="p"/>
                    </StackLayout>
                  </GridLayout>
                </v-template>
              </RadListView>
            </TabViewItem>
            <TabViewItem :title="$t('taskstoothers')">
              <RadListView ref="otherTAskListView" for="item in otherItemList"
                @itemTap="onOtherItemTap" @loaded="onOtherLoaded">
                <v-template>
                  <GridLayout columns="50, *, auto" rows="*" class="item"
                      paddingRight="5" paddingLeft="5">
                    <Image :src="item.image"  col="0" class="thumbnail"/>
                    <StackLayout col="1">
                      <label :text="item.workEffortName" class="h2"/>
                      <label :text="item.fullName" class="p"/>
                    </StackLayout>
                    <StackLayout col="2">
                      <label :text="item.priority" class="h2"/>
                      <label :text="$t(item.statusId)" class="p"/>
                    </StackLayout>
                  </GridLayout>
                </v-template>
              </RadListView>
            </TabViewItem>
        </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import TaskAdd from './modalPages/TaskAdd'
export default {
  mixins: [ sideDrawer,],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: '',
      myItemList: [],
      otherItemList: [],
    }
  },
  methods: {
      tabChange(args) {
        this.currentTab = args.value
      },
      onMyLoaded () {
        if (!this.myItemList.length) {
          this.$backendService.getTaskList(true).then( result => {
              this.myItemList = result.data.workEfforts
              this.myItemList.sort(function (a, b) {
                return (a.priority + a.workEffortName.toLowerCase())
                  .localeCompare(b.priority + b.workEffortName.toLowerCase())
              });
          })
        }
      },
      onOtherLoaded () {
        if (!this.otherItemList.length) {
          this.$backendService.getTaskList(false).then( result => {
              this.otherItemList = result.data.workEfforts
              this.otherItemList.sort(function (a, b) {
                return (a.priority + a.workEffortName.toLowerCase())
                  .localeCompare(b.priority + b.workEffortName.toLowerCase())
              })
          })
        }
      },
      onAddTap() { //get new item and insert sorted into list
          this.$showModal(TaskAdd).then (result => {
            let inserted = false
            if (result.partyId) { // for others
              for (let i=0; i < this.otherItemList.length; i++) {
                if (this.otherItemList[i].workEffortName.toUpperCase() >
                      result.workEffortName.toUpperCase()) {
                  this.otherItemList.splice(i,0,result); inserted=true;
                  break }}
                if(!inserted) this.otherItemList.push(result)
              if (this.currentTab !== 1) this.currentTab = 1
            } else { // for me
                for (let i=0; i < this.myItemList.length; i++) {
                  if (this.myItemList[i].workEffortName.toUpperCase()
                      > result.workEffortName.toUpperCase()) {
                    this.myItemList.splice(i,0,result); inserted = true; break }}
                  if(!inserted) this.myItemList.push(result)
                if (this.currentTab !== 0) this.currentTab = 0
            }
          })
      },
      onMyItemTap(args) {
          this.$navigateTo(this.$routes.TaskDetail,
            { props: {  list: this.myItemList,
                        index: args.index}})
      },
      onOtherItemTap(args) {
          this.$navigateTo(this.$routes.TaskDetail,
            { props: {  list: this.otherItemList,
                        index: args.index}})
      },
    }
}
</script>

<style lang="css">
</style>
