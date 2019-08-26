<template>
        <page>
	        <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
            <label :text="$t('orderExist')" class="h2" horizontalAlignment="center"/>
            <label :text="$t('selectExistOrNew')"  class="h3"/>
            <label :text="this.openOrders[0].table" class="h2" horizontalAlignment="center"/>
            <RadListView for="order in openOrders" height="50%"
                @itemTap="onOrderTap">
              <v-template>
                <GridLayout width="100%" columns="auto, auto, *" paddingTop="20">
                  <label :text="order.placedTime" class="h2" col="0"/>
                  <label :text="order.nbrOfItems" class="h2" col="1" paddingLeft="30"/>
                  <label :text="order.grandTotal" class="h2" col="2" paddingLeft="30"/>
                </GridLayout>
              </v-template>
            </RadListView>
            <Button class="button" :text="$t('cancel')" @tap="$modal.close()"/>
          </StackLayout>
        </page>
</template>

<script>
export default {
    name: 'AddOrder',
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
