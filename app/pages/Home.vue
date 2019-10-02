<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :openDrawer="openDrawer" header="dashBoard"/>
        <!--  :reload="true" :onActionTap="backToDefault"/-->
    </ActionBar>
    <StackLayout padding="20">
      <RadListView for="item in dashBoard" @itemTap="onItemTap"
          itemReorder="true" @itemReordered="onItemReordered" 
          layout="grid" itemHeight="100"><!--itemHeight for ios -->
        <v-template>
          <StackLayout orientation="vertical" padding="10">
            <Image :src="item.image" height="60"/>
            <Label :text="item.title" horizontalAlignment="center" class="h3"/>
          </StackLayout>
        </v-template>
      </RadListView>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
import { images } from '~/assets/imagesBase64'
import {Printer} from "nativescript-printer"
const appSettings = require("tns-core-modules/application-settings");

export default {
  name: 'Home',
  data() {
    return {
      dashBoard: [],
    }
  },
  mixins: [sideDrawer, general],
  beforeCreate() {
    this.$backendService.initData()
    this.$backendService.getAllPartyInfo()
    this.$backendService.getMyTasks()
    this.$backendService.getRequests()
  },
  created() {
    this.hideKeyboard()
//      if (appSettings.getString('dashBoard')) // need fixing
//        this.dashBoard = appSettings.getString('dashBoard')
//      else 
    this.backToDefault()
  },
  methods: {
    onItemReordered(args) {
        var index = args.index, data = args.data, object = args.object;
        appSettings.setString('dashBoard', JSON.stringify(this.dashBoard))
    },
    backToDefault() { // icons from : https://www.flaticon.com/
      this.dashBoard = [
        {id: 1, image: '~/assets/images/waiter.png', title: this.$t('order'),
          pageName: 'Orders', pageTab: 0},
        {id: 2, image: '~/assets/images/prep.png', title: this.$t('prepare'),
          pageName: 'Prepare', pageTab: 0},
        {id: 3, image: '~/assets/images/serve.png', title: this.$t('serve'),
          pageName: 'Orders', pageTab: 1},
        {id: 4, image: '~/assets/images/bill.png', title: this.$t('bill'),
          pageName: 'Orders', pageTab: 2},
        {id: 5, image: '~/assets/images/report.png', title: this.$t('reports'),
              pageName: 'Reports', pageTab: 0},
        {id: 6, image: '~/assets/images/task.png', title: this.$t('tasks'),
          pageName: 'Tasks', pageTab: 0},
        {id: 7, image: '~/assets/images/help.png', title: this.$t('help'),
              pageName: 'Help', pageTab: 0},
        this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN' ?
          {id: 8, image: '~/assets/images/setup.png', title: this.$t('setup'),
              pageName: 'SetUp', pageTab: 0}
        : {id: 8, image: '~/assets/images/myInfo.png', title: this.$t('myInfo'),
              pageName: 'MyInfo', pageTab: 0}
      ]
      //  appSettings.setString('dashBoard', JSON.stringify(this.dashBoard))
    },
    onItemTap(args) {
      this.$navigateTo(eval("this.$routes." + args.item.pageName),
          {props: { startTab: args.item.pageTab}})
    },
  },
}

</script>

<style lang="css">
</style>
