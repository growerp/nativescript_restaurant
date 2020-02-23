<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar header="admin" 
          :onHeaderTap="onHeaderTapHome" :back="true"
          :reload="reload" :onActionTap="backToDefault"/>
    </ActionBar>
    <GridLayout rows="*, auto, 200" class="p-10">
      <RadCartesianChart>
        <DateTimeContinuousAxis v-tkCartesianHorizontalAxis
          :minimum=fromDate :maximum=thruDate
          :majorStep=step :majorStepUnit=stepUnit :dateFormat=dateFormat
          labelFitMode="Rotate" labelRotationAngle="1.2"/>
        <LinearAxis v-tkCartesianVerticalAxis/>
        <LineSeries v-tkCartesianSeries :items="items" legendTitle="Amount" 
          categoryProperty="timeStamp" valueProperty="amount"/>
        <LineSeries v-tkCartesianSeries :items="items" legendTitle="Orders" 
          categoryProperty="timeStamp" valueProperty="orderCount"/>
        <RadLegendView v-tkCartesianLegend position="Right"
            width="75" height="75"/>
      </RadCartesianChart>
      <GridLayout columns="*,*,*" row="1">
        <Button col="0" :text="$t('day')" @tap="getReport('Day')"/>
        <Button col="1" :text="$t('week')" @tap="getReport('Week')"/>
        <Button col="2" :text="$t('month')" @tap="getReport('Month')"/>
      </GridLayout>
      <RadListView for="item in dashBoard" @itemTap="onItemTap" row="2"
          itemReorder="true" @itemReordered="onItemReordered"
          layout="grid" :gridSpanCount="5" itemHeight="100"><!--itemHeight for ios -->
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
const appSettings = require("tns-core-modules/application-settings");

export default {
    name: 'Home',
    data() {
      return {
        dashBoard: [],
        reload: false,
        items: [],
        fromDate: '',
        thruDate: '',
        stepUnit: '',
        step: 1,
        dateFormat: 'MMM-dd',
      }
    },
    mixins: [  general],
    created() {
      this.getReport('Day')
      console.log('====fromDate/ThruDate:  ' + this.fromDate + ' / ' + this.thruDate)
      console.log('====stepUnit/dateFormat: ' + this.stepUnit + ' / ' + this.dateFormat)
      console.log('====sales: ' + JSON.stringify(this.items))
      if (this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN') {
        if (appSettings.getString('setUp')) {
          this.reload = true
          this.dashBoard = JSON.parse(appSettings.getString('setUp'))
        } else this.backToDefault()
      }
    },
    methods: {
      getReport(type) {
        this.$backendService.reportSales(type).then( result => {
          this.items = result.data.periods
          this.fromDate = result.data.fromDate
          this.thruDate = result.data.thruDate
          if (type == 'Day') {
            this.stepUnit = 'Day'
            this.step=1
          }
          if (type == 'Week') {
            this.stepUnit = 'Day'
            this.step=5
          }
          if (type == 'Month') {
            this.stepUnit = 'Month'
            this.step=1
          }
          console.log('====fromDate/ThruDate:  ' + this.fromDate + ' / ' + this.thruDate)
          console.log('====stepUnit/dateFormat: ' + this.stepUnit + ' / ' + this.dateFormat)
          console.log('====sales: ' + JSON.stringify(this.items))
        })
        this.stepUnit = type
      },
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
          // {id: 7, image: '~/assets/images/payment.png', title: this.$t('upgrade'),
          //    pageName: 'Upgrade', pageTab: 0},
          {id: 8, image: '~/assets/images/export.png', title: this.$t('export'),
            pageName: 'Export', pageTab: 0},
          {id: 9, image: '~/assets/images/about.png', title: this.$t('about'),
            pageName: 'About', pageTab: 0},
          //{id: 10, image: '~/assets/images/printer.png', title: this.$t('printers'),
          //  pageName: 'Printers', pageTab: 0},
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
