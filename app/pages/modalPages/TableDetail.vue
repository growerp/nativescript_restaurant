<template>
  <page backgroundColor="#A0000000"><ModalStack dismissEnabled="true">
    <StackLayout  backgroundColor="white" padding="20" width="90%" height="70%">
      <label :text="$t('table') + this.openOrders[0].table" 
          class="h2" horizontalAlignment="center" row="0"/>
      <Gridlayout rows="*, auto, auto">
      <RadListView for="order,index in openOrders" row="0">
        <v-template name="header">
          <GridLayout width="100%" columns="auto, 100, *" background="#00CAAB">
            <StackLayout col="0">
              <label :text="$t('time')" class="h5" col="0"/>
              <label :text="$t('customer') + ' ' + $t('name')" class="h5" col="2"/>
            </StackLayout>
          </GridLayout>
        </v-template>
        <v-template>
          <Gridlayout columns="120,*,*">
            <StackLayout col="0">
              <label :text="order.placedTime" class="h4"/>
              <label :text="order.name" class="h4"/>
            </StackLayout>
            <label :text="$t('printed')" col="1" class="h5"
              :visibility="openOrders[index].statusId==='OrderApproved'?
                'visible':'hidden'"/>
            <Button :text="$t('addTo')" col="1" class="h5"
              @tap="onAddOrderTap(order)"
              :visibility="openOrders[index].statusId==='OrderApproved'?
                'hidden':'visible'"/>
            <Button :text="$t('cancel')" class="h5" 
              @tap="onCancelOrderTap(order)" col="2"/>
          </Gridlayout>
        </v-template>
      </RadListView>
      <Button :text="$t('billOrder')" @tap="onBillTap" row="1"
        :visibility="openOrders[0].statusId==='OrderApproved'?
          'hidden':'visible'"/>
      <GridLayout columns="*,*" row="2">
        <Button :text="$t('new')+$t('order')" col="0" 
          @tap="onNewOrderTap"/>
        <Button :text="$t('cancel')" col="1"
          @tap="$modal.close()" row="5"/>
        </GridLayout>
      </Gridlayout>
    </StackLayout>
  </ModalStack></page>
</template>

<script>
import general from '~/mixins/general'
export default {
    name: 'TableDetail',
    mixins: [general],
    props: {
      openOrders: Array,
      orderHeader: Object
    },
    methods: {
      onAddOrderTap(order) {
        this.$modal.close()
        this.orderHeader.orderId = order.orderId
        this.note(this.$t('addExistingOrderFrom') + order.placedTime)
        this.$navigateTo(this.$routes.OrderEntry, 
          {props: {orderHeader: this.orderHeader}})
      },
      onBillTap() {
        this.openOrders.forEach((order) => {
          if (order.statusId != 'OrderApproved') { // can be billed before
            this.$store.dispatch('orderStatus',
              {orderId: order.orderId, statusId: 'OrderApproved'}) // show in billing 
            this.note(this.$t('table') + ' ' + order.table + ' ' + this.$t('time') + ' ' + order.placedTime + ' ' + this.$t('tobeBilled'))
          }
        })
        this.$modal.close()
      },
      onCancelOrderTap(order) {
        this.$store.dispatch('orderStatus',
            {orderId: order.orderId, statusId: 'OrderCancelled'}) 
        this.note(this.$t('table') + ': ' + order.table + ' ' + this.$t('time') + ' ' + 
            order.placedTime + ' ' + this.$t('cancelled'))
        this.$modal.close()
      },
      onNewOrderTap() {
        this.$modal.close()
        this.$navigateTo(this.$routes.OrderData, 
            {props: { orderHeader: this.orderHeader}})
      }
    }
}

</script>

<style>
</style>
