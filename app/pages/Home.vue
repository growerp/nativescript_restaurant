<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar header="dashBoard"
        :reload="reload" :onActionTap="backToDefault" :onHeaderTap=null />
    </ActionBar>
    <GridLayout rows="*, 200" class="p-10">
      <Stacklayout row="0">
        <RadDataForm :source="orderHeader" :metadata="orderHeaderMeta"
          @propertyCommitted="onAreaCommitted" class="RadDataform"/>
        <label :text="$t('tables')" paddingLeft="10" color="#00CAAB"/>
        <RadListView for="table in tables" @itemTap="onTableTap"
              layout="grid" :gridSpanCount="6" itemHeight="50">
          <v-template>
            <Stacklayout padding="10"> 
            <Stacklayout :backgroundColor="table.ordered?'red':'#00CAAB'" style="border-radius: 20;"
               padding="5">
              <label :text="table.spotNumber" class="h2"
                horizontalAlignment="center" paddingTop="5"/>
            </Stacklayout></Stacklayout>
          </v-template>
        </RadListView>
      </Stacklayout>
      <RadListView for="item in dashBoard" @itemTap="onItemTap"
          itemReorder="true" @itemReordered="onItemReordered" row="1" 
          layout="grid" :gridSpanCount="5" itemHeight="90"><!--itemHeight for ios -->
        <v-template>
          <StackLayout>
            <Image :src="item.image" width="60"/>
            <Label :text="item.title"  class="h6" horizontalAlignment="center"/>
          </StackLayout>
        </v-template>
      </RadListView>
     </GridLayout>
  </Page>
</template>

<script>

import general from '~/mixins/general'
import TableDetail from './modalPages/TableDetail'
const appSettings = require("tns-core-modules/application-settings");

export default {
  name: 'Home',
  props: {
    accommodationAreaId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dashBoard: [],
      reload: false,
      orderHeader: {
        description: ''
      },
      orderHeaderMeta: {
        propertyAnnotations:[
          { name: 'description', displayName: this.$t('area'),
              editor: 'SegmentedEditor', 
              valuesProvider:
                this.$store.getters.accommodationAreasDesc(false)},
        ]
      },
      area: {},
      tables: [],
    }
  },
  mixins: [ general],
  created() {
    this.area = this.accommodationAreaId ?
      this.$store.getters.accommodationAreaById(this.accommodationAreaId):
      this.$store.getters.accommodationAreas[0]
    this.tables = this.$store.getters.accommodationSpotsByAreaId(
        this.area.accommodationAreaId)
    this.$store.dispatch('initData')
    this.hideKeyboard()
    if (appSettings.getString('dashBoard')) {
      this.reload = true
      this.dashBoard = JSON.parse(appSettings.getString('dashBoard'))
    } else this.backToDefault()
    this.orderHeader.description = this.area.description
  },
  methods: {
    onAreaCommitted(data) {
      let editedObject = JSON.parse(data.object.editedObject)
      this.area = this.$store.getters.accommodationAreaByDesc(
          editedObject.description)
      this.tables = this.$store.getters.accommodationSpotsByAreaId(
        this.area.accommodationAreaId)
    },
    onItemReordered(args) {
      appSettings.setString('dashBoard', JSON.stringify(this.dashBoard))
      this.reload = true
    },
    backToDefault() { // icons from : https://www.flaticon.com/
      this.dashBoard = [
        // {id: 1, image: '~/assets/images/waiter.png', title: this.$t('order'),
        //  pageName: 'Orders', pageTab: 0},
        {id: 2, image: '~/assets/images/prep.png', title: this.$t('inProcess'),
          pageName: 'InProcess', pageTab: 0},
        //{id: 3, image: '~/assets/images/serve.png', title: this.$t('serve'),
        //  pageName: 'Orders', pageTab: 1},
        //{id: 4, image: '~/assets/images/bill.png', title: this.$t('bill'),
        //  pageName: 'Billing', pageTab: 2},
        {id: 5, image: '~/assets/images/report.png', title: this.$t('reports'),
              pageName: 'Reports', pageTab: 0},
        //{id: 6, image: '~/assets/images/task.png', title: this.$t('tasks'),
        //  pageName: 'Tasks', pageTab: 0},
        {id: 7, image: '~/assets/images/help.png', title: this.$t('help'),
              pageName: 'Help', pageTab: 0},
        {id: 8, image: '~/assets/images/myInfo.png', title: this.$t('myInfo'),
              pageName: 'MyInfo', pageTab: 0},
        {id: 9, image: '~/assets/images/logout.png', title: this.$t('logout'),
              pageName: 'Logout', pageTab: 0},
        this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN' ?
          {id: 10, image: '~/assets/images/setup.png', title: this.$t('admin'),
              pageName: 'SetUp', pageTab: 0}: ''
      ]
      appSettings.remove('dashBoard')
      this.reload = false
    },
    onItemTap(args) {
      if (args.item.pageName === 'MyInfo')
        this.$navigateTo(this.$routes.UserDetail,
            {props: { item: this.$store.getters.currentEmployee, myInfo: true}})
      else if (args.item.pageName === 'Logout') {
          this.$backendService.removeKey()
          console.log('logged out')
          this.$navigateTo(this.$routes.Login, {clearHistory: true})
//            exit() // exit caused update of apiKey to be ignored
      } else
        this.$navigateTo(eval("this.$routes." + args.item.pageName),
            {props: { startTab: args.item.pageTab}})
    },
    onTableTap(args) {
      let openOrders = this.$store.getters.openOrdersByAreaSpotId(
            args.item.accommodationSpotId)
      let orderHeader = {
          accommodationAreaId:  args.item.accommodationAreaId,
          description:          this.area.description,
          accommodationSpotId:  args.item.accommodationSpotId,
          spotNumber:           args.item.spotNumber,
      }
      if (openOrders.length == 0) {
        this.$navigateTo(this.$routes.OrderData, 
            { props: { orderHeader: orderHeader }})
      } else {
        this.$showModal(TableDetail, 
            { props: { openOrders: openOrders, orderHeader: orderHeader}})
        .then(() => {
          this.tables = this.$store.getters.accommodationSpotsByAreaId(
            this.area.accommodationAreaId)
        })
      }
    },
  },
}
</script>

<style lang="css">
</style>
