<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="bill"/>
    </ActionBar>
    <GridLayout rows="*, auto, 50" class="p-10">
      <Accordion row="0" height="80%"
            ref="accordion" allowMultiple="false"
            :visibility="billOrders.length ? 'visible':'collapse'"
            for="item of billOrders"  childItems="items">
        <v-template name="title">
          <GridLayout columns="50,*,auto, auto, 5, auto, 5, auto" rows="*" class="m-10">
            <Image :src="item.image"  col="0" class="thumbnail"/>
            <StackLayout col="1" paddingLeft="10">
              <Label :text="item.placedTime" class="h3"/>
              <Label :text="item.table" class="h3"/>
            </StackLayout>
            <Label col="2" :text="item.grandTotal" class="h2" paddingRight="10"/>
            <Label class="button" col="3" :text="$t('cancel')" @tap="setCancel(item)" padding="10"/>
            <Label class="button" col="5" :text="$t('print')" @tap="print(item)" padding="10"/>
            <Label class="button" col="7" :text="$t('done')" @tap="setDone(item)" padding="10"/>
          </GridLayout>
        </v-template>
        <v-template name="content">
          <GridLayout columns="50, *, 30, 70, 70" rows="*" class="item"
              paddingRight="5" paddingLeft="25" >
            <Image :src="item.image"  col="0" class="thumbnail"/>
            <Label :text="item.description" class="h2" col="1"/>
            <Label :text="item.quantity" class="h2" col="2" paddingRight="10"/>
            <Label :text="item.price" class="h2" col="3" paddingRight="10"/>
            <Label :text="item.totalAmount" class="h2" col="4"/>
          </GridLayout>
        </v-template>
      </Accordion>
      <GridLayout columns="*" rows="*" height="80%" row="0"
            :visibility="billOrders.length ? 'collapse':'visible'">
        <Label class="message" col="0" row="0"
            :text="$t('noOrdersTo') + ' ' + $t('bill')"/>
      </GridLayout>
      <Button class="button" :text="$t('refresh')" @tap="refresh"
              width="50%" row="1"/>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
import { AutoCompleteDisplayMode } from 'nativescript-ui-dataform'
export default {
  name: 'bill',
  mixins: [ sideDrawer, general],
  data () {
    return {
      billOrders: this.$store.getters.ordersByStatusId('OrderApproved')
    }
  },
  methods: {
    refresh() {
      this.billOrders = this.$store.getters.ordersByStatusId('OrderApproved')
    },
    setDone(item) {
      this.$store.dispatch('changeOrderStatus', {
        orderStatusId: 'OrderCompleted', orderId: item.orderId}) 
      this.billOrders = this.$store.getters.ordersByStatusId('OrderApproved')
      this.note(this.$t('table') + ' ' + item.table + this.$t('isNowPaid'))
    },
    setCancel(item) {
      this.$store.dispatch('changeOrderStatus', {
        orderStatusId: 'OrderCancelled', orderId: item.orderId}) 
      this.billOrders = this.$store.getters.ordersByStatusId('OrderApproved')
      this.note(this.$t('table') + ' ' + item.table + this.$t('cancelled'))
    },
    print(item) {
      this.$navigateTo(this.$routes.OrderPrint, { props: { orderId: item.orderId}})
    },
  }
}
</script>

<style lang="css">
</style>
