<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :openDrawer="openDrawer" header="admin" 
          :onHeaderTap="onHeaderTapHome"
          :reload="reload" :onActionTap="backToDefault"/>
    </ActionBar>
    <GridLayout rows="*, 250, 50" class="p-10">
    <RadCartesianChart row="0">
      <DateTimeContinuousAxis v-tkCartesianHorizontalAxis
        minimum="19/12/2019" maximum="27/12/2019"
        majorStep="1" majorStepUnit="Day" dateFormat="MMM-dd"
        labelFitMode="Rotate" labelRotationAngle="1.2"/>
      <LinearAxis v-tkCartesianVerticalAxis/>
      <LineSeries v-tkCartesianSeries :items="items"
          categoryProperty="timeStamp"
          valueProperty="orderCount" legendTitle="orders"/>
      <LineSeries v-tkCartesianSeries :items="items"
          categoryProperty="timeStamp"
          valueProperty="amount" legendTitle="Amount"/>
      <RadLegendView v-tkCartesianLegend position="Right" width="75" height="75"/>
    </RadCartesianChart>
      <RadListView for="item in dashBoard" @itemTap="onItemTap" row="1"
          itemReorder="true" @itemReordered="onItemReordered"
          layout="grid" :gridSpanCount="5" itemHeight="100"><!--itemHeight for ios -->
        <v-template>
          <StackLayout orientation="vertical" padding="10">
            <Image :src="item.image" height="40"/>
            <Label :text="item.title" horizontalAlignment="center" class="h4"/>
          </StackLayout>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
const appSettings = require("tns-core-modules/application-settings");

export default {
    name: 'Home',
    data() {
      return {
        dashBoard: [],
        reload: false,
        items: [],
      }
    },
    mixins: [ sideDrawer, general],
    created() {
      this.$backendService.reportSales('day').then( result => {
        this.items = result.data.periods
        // console.log('====weeksales: ' + JSON.stringify(this.items))
      })
      if (this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN') {
        if (appSettings.getString('setUp')) {
          this.reload = true
          this.dashBoard = JSON.parse(appSettings.getString('setUp'))
        } else this.backToDefault()
      }
    },
    methods: {
      onItemReordered(args) {
          appSettings.setString('setUp', JSON.stringify(this.dashBoard))
          this.reload = true
      },
      backToDefault() { // icons from : https://www.flaticon.com/
        if (this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN') {
          this.dashBoard = [
          {id: 0, image: '~/assets/images/company.png', title: this.$t('restaurant'),
            pageName: 'Company'},
          {id: 1, image: '~/assets/images/prep.png', title: this.$t('prepLoc'),
            pageName: 'Locations', pageTab: 0},
          {id: 2, image: '~/assets/images/tables.png', title: this.$t('tables'),
              pageName: 'Locations', pageTab: 1},
          {id: 3, image: '~/assets/images/category.png', title: this.$t('category'),
            pageName: 'Categories', pageTab: 0},
          {id: 4, image: '~/assets/images/product.png', title: this.$t('product'),
              pageName: 'Products', pageTab: 1},
          {id: 5, image: '~/assets/images/users.png', title: this.$t('employee'),
            pageName: 'Organization', pageTab: 0},
          {id: 6, image: '~/assets/images/customers.png', title: this.$t('customer'),
            pageName: 'Organization', pageTab: 1},
          {id: 7, image: '~/assets/images/payment.png', title: this.$t('upgrade'),
              pageName: 'Upgrade', pageTab: 0},
          {id: 8, image: '~/assets/images/export.png', title: this.$t('export'),
            pageName: 'Export', pageTab: 0},
          {id: 9, image: '~/assets/images/about.png', title: this.$t('about'),
            pageName: 'About', pageTab: 0},
          ]
          appSettings.remove('setUp')
          this.reload = false
        }
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
