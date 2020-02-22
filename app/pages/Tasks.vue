<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap=null :plus="true" :back=true 
          :onActionTap="onAddTap" header="tasksMeOthers"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">
        <TabViewItem :title="$t('mytasks')">
          <RadListView for="item in myItemList" height="100%">
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" padding="5"
                  @tap="onItemTap(item)"
                  @longPress="onDeleteTap(item)">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <StackLayout col="1">
                  <label :text="item.workEffortName" class="h2"/>
                  <label :text="item.userFullName" class="h3"/>
                </StackLayout>
                <StackLayout col="2">
                  <label :text="item.priority" class="h2"/>
                  <label :text="$t(item.statusId)" class="h3"/>
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
        </TabViewItem>
        <TabViewItem :title="$t('taskstoothers')">
          <RadListView for="item in otherItemList">
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" padding="5"
                  @tap="onItemTap(item)"
                  @longPress="onDeleteTap(item)">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <StackLayout col="1">
                  <label :text="item.workEffortName" class="h2"/>
                  <label :text="item.userFullName" class="h3"/>
                </StackLayout>
                <StackLayout col="2">
                  <label :text="item.priority" class="h2"/>
                  <label :text="$t(item.statusId)" class="h3"/>
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
        </TabViewItem>
    </TabView>
  </Page>
</template>

<script>

import TaskAdd from './modalPages/TaskAdd'
import Confirm from './modalPages/Confirm'
import general from '~/mixins/general'
export default {
  mixins: [  general],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: '',
      myItemList: this.$store.getters.myTasks,
      otherItemList: this.$store.getters.otherTasks,
    }
  },
  methods: {
    tabChange(args) {
      this.currentTab = args.value
    },
    onAddTap() {
      this.$showModal(TaskAdd)
    },
    onItemTap(item) {
        this.$navigateTo(this.$routes.TaskDetail,
          { props: {  item: item}})
    },
    onDeleteTap(item) {
      this.$showModal(Confirm,{ props: {
          message: this.$t('deleteTask') + item.workEffortName + "?"}
      }).then (data => {
        if (data) {
          this.$backendService.deleteTask(item.workEffortId)
          this.$store.commit('task', {verb: 'delete',
                workEffortId: item.workEffortId})
        }
      })
    },
  }
}
</script>

<style lang="css">
</style>
