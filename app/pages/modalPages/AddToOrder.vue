<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout  backgroundColor="white" padding="20" width="90%">
    <GridLayout rows="auto,auto,auto,auto,50">
      <label :text="$t('orderExist')" class="h2" horizontalAlignment="center"
          row="0"/>
      <label :text="this.openOrders[0].table" class="h2" 
          horizontalAlignment="center" row="1"/>
      <label :text="$t('selectExistOrNew')"  class="h3" 
          row="2" horizontalAlignment="center"/>
      <RadListView for="order in openOrders" @itemTap="onOrderTap" 
        height="50%" row="3">
        <v-template>
          <GridLayout width="100%" columns="auto, 30, auto, 30, *" padding="20">
            <label :text="order.placedTime" class="h2" col="0"/>
            <label :text="order.nbrOfItems" class="h2" col="2"/>
            <label :text="order.grandTotal" class="h2" col="4"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('cancel')" @tap="$modal.close()" row="4"/>
    </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
    name: 'AddToOrder',
    props: {
      openOrders: Array,
      areaDescription: String,
      spotNumber: String
    },
    methods: {
        onOrderTap(args) {
          this.$modal.close(this.openOrders[args.index])
        },
    }
}

</script>

<style>
</style>
