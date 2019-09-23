<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="orders"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">
      <TabViewItem :title="$t('takeOrder')">
        <StackLayout>
          <Label class="h3" :text="$t('selectTableLocation')"
                horizontalAlignment="center"/>
          <RadDataForm :source="orderHeader" :metadata="orderHeaderMeta"
            @propertyCommitted="onHeaderCommitted"/>
          <label :text="$t('tables')" paddingLeft="15"/>
          <RadListView for="table in tableMatrix">
            <v-template>
              <GridLayout columns="*, *, *, *, *, *" rows="*">
                <label :text="table[0]?table[0].spotNumber:''" class="h2"
                    col="0" horizontalAlignment="center" 
                    @tap="onSpotSelect(table[0])"/>
                <label :text="table[1]?table[1].spotNumber:''" class="h2"
                    col="1" horizontalAlignment="center"
                    @tap="onSpotSelect(table[1])"/>
                <label :text="table[2]?table[2].spotNumber:''" class="h2"
                    col="2" horizontalAlignment="center"
                    @tap="onSpotSelect(table[2])"/>
                <label :text="table[3]?table[3].spotNumber:''" class="h2"
                    col="3" horizontalAlignment="center"
                    @tap="onSpotSelect(table[3])"/>
                <label :text="table[4]?table[4].spotNumber:''" class="h2"
                    col="4" horizontalAlignment="center"
                    @tap="onSpotSelect(table[4])"/>
                <label :text="table[5]?table[5].spotNumber:''" class="h2"
                    col="5" horizontalAlignment="center"
                    @tap="onSpotSelect(table[5])"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </StackLayout>
      </TabViewItem>
      <TabViewItem :title="$t('serve')">
        <StackLayout>
          <Accordion row="1" col="0" colSpan="3" height="80%"
              :visibility="servOrders.length ? 'visible':'collapse'"
                ref="accordion" allowMultiple="false"
                for="item of servOrders"  childItems="items">
            <v-template name="title">
              <GridLayout columns="50,10,*,auto,70" rows="*" paddingLeft="10">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <StackLayout col="2">
                  <Label :text="item.prepDescription" class="h2"/>
                  <label :text="$t('quantity') + ': ' + item.totalQuantity" class="p"/>
                </StackLayout>
                <Label :text="item.description + '-' + item.spotNumber"
                    paddingRight="20" class="h2" col="3"/>
                <Label class="button" :text="$t('done')" col="4" paddingRight="5"
                      @tap="setDone(item)"/>
              </GridLayout>
            </v-template>
            <v-template name="content">
              <GridLayout columns="50, *, auto" rows="*" class="item"
                      paddingRight="5" paddingLeft="25" >
                    <Image :src="item.image"  col="0" class="thumbnail"/>
                    <Label :text="item.itemDescription" class="h2" col="1"/>
                    <Label :text="item.quantity" class="h2" col="2"/>
              </GridLayout>
            </v-template>
          </Accordion>
          <GridLayout columns="*" rows="*" height="80%"
                :visibility="servOrders.length ? 'collapse':'visible'">
              <Label class="message" col="0" row="0"
              :text="$t('noOrdersTo') + ' ' + $t('serve')"/>
          </GridLayout>
          <Button class="button" :text="$t('refresh')" @tap="refresh()"
                  width="50%"/>
        </StackLayout>
      </TabViewItem>
      <TabViewItem :title="$t('bill')">
        <StackLayout>
          <Accordion row="1" col="0" colSpan="3" height="80%"
                ref="accordion" allowMultiple="false"
                :visibility="billOrders.length ? 'visible':'collapse'"
                for="item of billOrders"  childItems="items">
            <v-template name="title">
              <GridLayout columns="50,*,auto, auto, 5, auto" rows="*" paddingLeft="10">
                <Image col="0" :src="item.image" class="thumbnail"/>
                <Label col="1" :text="item.description + '-' + item.spotNumber"
                    class="h2" paddingLeft="10"/>
                <Label col="2" :text="item.totalAmount" class="h2" paddingRight="10"/>
                <Label class="button" col="3" :text="$t('print')" @tap="print(item)" padding="10"/>
                <Label class="button" col="5" :text="$t('done')" @tap="setDone(item)" padding="10"/>
              </GridLayout>
            </v-template>
            <v-template name="content">
              <GridLayout columns="50, *, 30, 70, 70" rows="*" class="item"
                  paddingRight="5" paddingLeft="25" >
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <Label :text="item.itemDescription" class="h2" col="1"/>
                <Label :text="item.quantity" class="h2" col="2" paddingRight="10"/>
                <Label :text="item.price" class="h2" col="3" paddingRight="10"/>
                <Label :text="Number(item.price) * Number(item.quantity)" class="h2" col="4"/>
              </GridLayout>
            </v-template>
          </Accordion>
          <GridLayout columns="*" rows="*" height="80%"
                :visibility="billOrders.length ? 'collapse':'visible'">
            <Label class="message" col="0" row="0"
                :text="$t('noOrdersTo') + ' ' + $t('bill')"/>
          </GridLayout>
          <Button class="button" :text="$t('refresh')" @tap="refresh()"
                  width="50%"/>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import AddToOrder from './modalPages/AddToOrder'
import general from '~/mixins/general'
import * as frameModule from 'tns-core-modules/ui/frame'
import { AutoCompleteDisplayMode } from 'nativescript-ui-dataform'
export default {
  name: 'orders',
  mixins: [ sideDrawer, general],
  props: {
      startTab: Number
  },
  data () {
    return {
      text: 'Order Page',
      currentTab: 0,
      editedOrderHeader: {},
      orderHeader: {
        areaDescription: '',
      },
      orderHeaderMeta: {
          propertyAnnotations:[
              { name: 'areaDescription', displayName: this.$t('areaName'),
                  editor: 'SegmentedEditor', index: 3,
                  valuesProvider:  this.$store.getters.accommodationAreasDesc(false)},
          ]
      },
      areaId: '',
      areaDescription: '',
      tableMatrix: this.makeTableMatix(
              this.$store.getters.accommodationAreas[0].accommodationAreaId),
      servOrders: [[]],
      billOrders: [[]],
    }
  },
  created() {
    if (this.$store.getters.accommodationAreas.length == 0) {
      this.note(this.$t('noAreasTables'))
      this.$navigateTo(this.$routes.Locations, {props: {startTab: 1}})
    } else {
      this.currentTab = this.startTab
      this.areaId = this.$store.getters.accommodationAreas[0].accommodationAreaId,
      this.$backendService.getOrdersAndItems('serv').then( result => {
          this.servOrders = result.data.ordersAndItems})
      this.$backendService.getOrdersAndItems('bill').then( result => {
          this.billOrders = result.data.ordersAndItems})
    }
  },
  methods: {
    tabChange(args) {
        this.currentTab = args.value
    },
    onHeaderCommitted(data) {
      console.log('committed object:' + data.object.editedObject)
      this.areaDescription = JSON.parse(data.object.editedObject).areaDescription
      this.areaId = this.$store.getters.accommodationAreaByDesc(
          JSON.parse(data.object.editedObject).areaDescription).accommodationAreaId
      this.tableMatrix = this.makeTableMatix(this.areaId)
      this.editedOrderHeader = JSON.parse(data.object.editedObject)
    },
    refresh() {
      if (this.currentTab == 1) {
          this.$backendService.getOrdersAndItems('serv').then( result => {
              this.servOrders = result.data.ordersAndItems})}
      if (this.currentTab == 2) {
          this.$backendService.getOrdersAndItems('bill').then( result => {
              this.billOrders = result.data.ordersAndItems})}
    },
    setDone(item) {
      if (this.currentTab == 1) {
        for (let i=0; i < this.servOrders.length; i++) {
          if (this.servOrders[i].orderId == item.orderId) {
            this.servOrders.splice(i,1)
            break}}
      }
      let newStat = 'bill'
      let partId = item.orderPartSeqId
      if (this.currentTab === 2) {
        newStat = 'completed'
        partId = null
        for (let i=0; i < this.billOrders.length; i++) {
          if (this.billOrders[i].orderId == item.orderId) {
            this.billOrders.splice(i,1); break}}
      }
      this.$backendService.changeOrderPartStatus(item.orderId, partId, newStat)
      .then(() => {
        if (this.currentTab == 1) {
          this.note(this.$t('table') + ' ' + item.description + '-' +
              item.spotNumber + this.$t('isServedFrom') + item.prepDescription)}
        if (this.currentTab == 2) {
          this.note(this.$t('table') + ' ' + item.description + '-' +
                  item.spotNumber + this.$t('isNowPaid'))
          this.$backendService.getOrdersItemsPartySpot()} //update store
      })
    },
    print(item) {
      this.$navigateTo(this.$routes.OrderPrint, { props: { orderId: item.orderId}})
    },
    makeTableMatix(areaId) { // same as in locations tablearea
      let tables = this.$store.getters.
              accommodationSpotsByAreaId(areaId)
      let tableMatrix = []
      let record = 0
      while (record < tables.length) {
        let tableRecord = []
        for (let count = 0; count < 6 ; count++) {
            let table = {}
            if (tables[record]) {
                table = tables[record++]
                tableRecord.push(table)
            } else { break}}
        tableMatrix.push(tableRecord)}
      return tableMatrix
    },
    onSpotSelect(table) {
      let openOrders = this.$store.getters.openOrdersByAreaSpot(
            table.accommodationAreaId, table.accommodationSpotId)
      let externalId = this.editedOrderHeader.externalId?
              this.editedOrderHeader.externalId:
              this.editedOrderHeader.newExternalId
      let itemProps = { props: { orderHeader: {
          accommodationAreaId:  this.areaId,
          description:          this.areaDescription,
          accommodationSpotId:  table.accommodationSpotId,
          spotNumber:           table.spotNumber,
          externalId:           externalId,
          nbrOfGuests:          this.editedOrderHeader.nbrOfGuests,
      }}}
      if (openOrders.length > 0) {
        this.$showModal(AddToOrder, {props: { openOrders: openOrders,
            areaDescription: this.areaDescription, spotNumber: table.spotNumber}})
        .then( result => {
          if (result) {
            itemProps.props.orderHeader.orderId = result.orderId
            this.note(this.$t('addExistingOrderFrom') + result.placedTime)
          } else {
            this.$navigateTo(this.$routes.OrderData, itemProps)
          }
        })
        this.$navigateTo(this.$routes.OrderEntry, itemProps)
      } else {
        this.$navigateTo(this.$routes.OrderData, itemProps)
      }
    },
  }
}
</script>

<style lang="css">
</style>
