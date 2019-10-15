<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="reports"/>
    </ActionBar>
    <TabView>
      <TabViewItem :title="$t('allOrders')">
        <StackLayout>
          <RadDataForm :source="orderParm" :metadata="orderParmMeta"
            @propertyCommitted="onHeaderCommitted"/>
          <Accordion row="1" col="0" colSpan="3" height="100%"
              ref="accordion" allowMultiple="false"
              for="item of ordersAndItems" childItems="items">
            <v-template name="title">
              <GridLayout columns="auto, *, auto, auto, 100" rows="*" class="item"
                  paddingRight="5" paddingLeft="5"
                  backgroundColor="rgb(211, 215, 207)">
                <Label :text="item.placedDate" col="0" padding="10"
                  verticalAlignment="center"/>
                <StackLayout col="1">
                  <Label :text="item.table" padding="10" class="h3"/>
                  <label :text="item.firstName + ' ' + item.lastName" class="h3"/>
                </StackLayout>
                <Label :text="item.nbrOfGuests" col="2" padding="10"/>
                <Label :text="item.grandTotal" col="3" padding="10"/>
                <Label :text="item.statusId" col="4" padding="10"/>
              </GridLayout>
            </v-template>
            <v-template name="content">
              <GridLayout columns="10, *, auto, auto, auto" rows="*" class="item"
                  paddingRight="5" paddingLeft="5">
                <label :text="item.description" class="h3" col="1" padding="10"/>
                <label :text="item.quantity" col="2" padding="10"/>
                <label :text="item.price" col="3" padding="10"/>
                <label :text="item.totalAmount" col="4" padding="10"/>
              </GridLayout>
            </v-template>
          </Accordion>
        </StackLayout>
      </TabViewItem>
      <TabViewItem :title="$t('salesPerDay')">
        <StackLayout>
        <RadCartesianChart height="50%">
          <BarSeries v-tkCartesianSeries categoryProperty="period"
              valueProperty="amount" :items="daySales"/>
          <CategoricalAxis v-tkCartesianHorizontalAxis/>
          <LinearAxis v-tkCartesianVerticalAxis/>
        </RadCartesianChart>
        <RadListView ref="listDay" for="item in daySales">
          <v-template>
            <GridLayout columns="10,auto, 10, auto, 10, auto, 10, auto,10, auto, 10, auto, 10" rows="*" class="item">
              <Label :text="$t('dateStart')" col="1"/>
              <Label :text="item.period" col="3"/>
              <Label :text="$t('order') + 's:'" col="5"/>
              <Label :text="item.orderCount" col="7"/>
              <Label :text="$t('totalAmount') + ':'" col="9"/>
              <Label :text="item.amount" col="11"/>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
      </TabViewItem>
      <TabViewItem :title="$t('salesPerWeek')">
        <StackLayout>
          <RadCartesianChart height="50%">
            <BarSeries v-tkCartesianSeries categoryProperty="period"
                valueProperty="amount" :items="weekSales"/>
            <CategoricalAxis v-tkCartesianHorizontalAxis />
            <LinearAxis v-tkCartesianVerticalAxis />
          </RadCartesianChart>
          <RadListView ref="listWeek" for="item in weekSales" height="50%">
            <v-template>
              <GridLayout columns="10,auto, 10, auto, 10, auto, 10, 30,10, auto, 10, auto, 10" rows="*" class="item">
                <Label text="date start:" col="1"/>
                <Label :text="item.period" col="3"/>
                <Label :text="$t('order') + 's:'" col="5"/>
                <Label :text="item.orderCount" col="7"/>
                <Label :text="$t('totalAmount') + ':'" col="9"/>
                <Label :text="item.amount" col="11"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
export default {
  mixins: [ sideDrawer, general ],
  props: {
      startTab: Number,
      startDate: '',
      open: Boolean
  },
  data () {
    return {
      daySales: [],
      weekSales: [],
      ordersAndItems: [],
      orderParm: { startDate: '', open: this.open},
      orderParmMeta: {
        propertyAnnotations:[
          { name: 'startDate', editor: 'DatePicker' },
          { name: 'open', displayName: 'Open Orders', editor: 'Switch' },
        ]
      }
    }
  },
  created() {
    this.$backendService.getOrders(this.open, this.startDate).then( result => {
      this.ordersAndItems = result.data.ordersAndItems
      // console.log('====orders and items: ' + JSON.stringify(this.ordersAndItems))
    })
    this.$backendService.reportSales('day').then( result => {
      this.daySales = result.data.periods
      // console.log('====daysales: ' + JSON.stringify(this.daySales))
    })
    this.$backendService.reportSales('week').then( result => {
      this.weekSales = result.data.periods
      // console.log('====weeksales: ' + JSON.stringify(this.weekSales))
    })
  },
  methods: {
    onHeaderCommitted(data) {
      this.$navigateTo(this.$routes.Reports,
        { props: { startDate: JSON.parse(data.object.editedObject).startDate,
                  open: JSON.parse(data.object.editedObject).open}})
    },
  }
}
</script>

<style lang="css">
</style>
