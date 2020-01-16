<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout  backgroundColor="white" padding="20" width="90%">
    <GridLayout rows="auto,10,auto,10,auto,50">
      <label :text="$t('table') + this.openOrders[0].table" 
          class="h2" horizontalAlignment="center" row="0"/>
      <RadListView for="order,index in openOrders" height="40%" row="2">
        <v-template name="header">
          <GridLayout width="100%" columns="auto, 100, *">
            <StackLayout col="0">
              <label :text="$t('time')" class="h3" col="0"/>
              <label :text="$t('customer') + ' ' + $t('name')" class="h3" col="2"/>
            </StackLayout>
          </GridLayout>
        </v-template>
        <v-template>
          <GridLayout width="100%" columns="*, 10, auto, 10, auto" class="m-10">
            <StackLayout col="0">
              <label :text="order.placedTime" class="h3"/>
              <label :text="order.name" class="h3"/>
            </StackLayout>
            <label text="Printed" class="h2" col="2"
              :visibility="openOrders[index].statusId==='OrderApproved'?
                'visible':'hidden'"/>
            <Button class="button" :text="$t('addTo')" 
              @tap="onAddOrderTap(order)" col="2"
              :visibility="openOrders[index].statusId==='OrderApproved'?
                'hidden':'visible'"/>
            <Button class="button" :text="$t('cancel')" 
              @tap="onCancelOrderTap(order)" col="4"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <StackLayout row="4">
        <Button class="button" :text="$t('billOrder')" @tap="onBillTap"
          :visibility="openOrders[0].statusId==='OrderApproved'?
            'hidden':'visible'"/>
        <Button class="button" :text="$t('new')+$t('order')" @tap="onNewOrderTap"/>
        <Button class="button" :text="$t('cancel')"
          @tap="$modal.close()" row="5"/>
      </StackLayout>
    </GridLayout>
    </StackLayout></ModalStack>
  </page>
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
            this.$store.dispatch('changeOrderStatus',
              {orderId: order.orderId, statusId: 'OrderApproved'}) // show in billing 
            this.note(this.$t('time') + ' ' + order.placedTime + ' ' + this.$t('tobeBilled'))
          }
        })
        this.$modal.close()
      },
      onCancelOrderTap(order) {
        this.$store.dispatch('changeOrderStatus',
            {orderId: order.orderId, statusId: 'OrderCancelled'}) 
        this.note(this.$t('time') + ' ' + 
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
