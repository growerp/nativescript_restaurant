<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar>
        <GridLayout width="100%" columns="auto, auto, *">
            <Label class="title" :text="$t('back')" col="0" @tap="$navigateBack"/>
            <Label class="title" :text="header" col="1" @tap="onHeaderTap"/>
            <Label class="title" :text="$t('totalAmount') + ': ' + getOrderTotal" col="2" />
        </GridLayout>
    </ActionBar>

    <StackLayout>
      <GridLayout columns="auto,auto,*" rows="*,auto">
        <RadListView ref="listView" for="item in orderItems"
              row="0" colSpan="3"
              @itemTap="onItemDeleteTap" height="80%"
              :visibility="orderItems.length? 'visible':'collapse'">
          <v-template>
            <GridLayout columns="50, *, auto, auto, auto" rows="*" class="item">
              <Image :src="item.image"  col="0" class="thumbnail"/>
              <label :text="item.name" class="h2"
                  col="1" paddingLeft="10"/>
              <label :text="item.quantity" class="h2" col="2"
                  paddingRight="10"/>
              <label :text="item.price" class="h2" col="3"
                  paddingRight="10"/>
              <label :text="Number(item.price) * Number(item.quantity)"
                  class="h2" col="4" paddingRight="10"/>
            </GridLayout>
          </v-template>
        </RadListView>
        <GridLayout columns="*" rows="*" height="80%" row="0" colSpan="3"
            :visibility="orderItems.length? 'collapse':'visible'">
          <Label class="message" col="0" row="0"
              :text="$t('noItemsOnOrderAddSome')"/>
        </GridLayout>
        <GridLayout columns="*,*" rows="auto" row="1" colSpan="3">
          <Button class="button" :text="$t('cancel')" 
            @tap="$navigateTo($routes.Orders)" col="0"/>
          <Button class="button" :text="$t('saveOrder')" 
              @tap="saveOrder" col="1"
              :visibility="orderItems.length? 'visible':'hidden'"/>
        </GridLayout>
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import general from '~/mixins/general'
    export default {
        name: 'OrderItems',
        props: {
            orderHeader: {},
            orderItems: ''
        },
        mixins: [ general ],
        computed: {
            getOrderTotal: function () {
                let items = this.orderItems.length; let quantities = 0; let totalPrice = 0.00
                for (let i = 0; i < items; i++) {
                    quantities += this.orderItems[i].quantity
                    totalPrice += (this.orderItems[i].quantity * this.orderItems[i].price)}
                return(totalPrice.toFixed(2))
            }
        },
        data() {
            return {
                header: this.$t('orderFor') + this.orderHeader.description +
                    this.$t('table') + ' ' + this.orderHeader.spotNumber,
            }
        },
        methods: {
          onHeaderTap() {
            this.$navigateTo(this.$routes.Home)
          },
          saveOrder() {
                this.$backendService.createSalesOrder(this.orderHeader, this.orderItems)
                .then( result => {
                    this.$backendService.getCustomersInStore()
                    if (this.orderHeader.orderId) {
                      this.note(this.$t('orderUpdated') + result.data.orderId +
                        this.$t('appearPrepArea'))
                    } else {
                      this.note(this.$t('orderReceived') + result.data.orderId +
                          this.$t('appearPrepArea'))
                    }
                })
                this.$navigateTo(this.$routes.Home)
          },
          onItemDeleteTap(args) {
              this.orderItems.splice(args.index,1)
          },
      }
    }
</script>

<style lang="css">

</style>
