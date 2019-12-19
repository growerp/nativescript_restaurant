<template>
  <Page><ActionBar><Label text=''/></ActionBar>
    <StackLayout padding="10" visibility="hidden">
      <Image :src="company.image" height="200"/>
      <Label :text="company.organizationName" class="h2" horizontalAlignment="center"/>
      <Label :text="$t('table') + order.table" class="h2" horizontalAlignment="center"/>
      <RadListView ref="listView" for="item in order.items" @loaded="onLoaded">
        <v-template>
          <GridLayout columns="*, 30, 70, 70" rows="*" class="item">
              <Label :text="item.description" class="h2"
                  col="0" paddingLeft="10"/>
              <Label :text="item.quantity" class="h2" col="1"
                  paddingRight="10"/>
              <Label :text="item.price" class="h2" col="2"
                  paddingRight="10"/>
              <Label :text="Number(item.price) * Number(item.quantity)"
                  class="h2" col="3" paddingRight="10"/>
          </GridLayout>
        </v-template>
        <v-template name="footer">
          <Label :text="$t('totalAmount') + ': ' + order.grandTotal + ' ' + company.currencyId"
              class="h2"/>
        </v-template>
      </RadListView>
    </StackLayout>
  </Page>
</template>

<script>
import {Printer} from "nativescript-printer"
export default {
    name: 'OrderPrint',
    props: {
        orderId: String,
    },
    data () {
      return {
        company: this.$store.getters.company,
        order: this.$store.getters.openOrderById(this.orderId),
      }
    },
    methods: {
      onLoaded() {
        this.order = this.$store.getters.openOrderById(this.orderId)
        this.items = this.order.items
        setTimeout(this.showPrint, 300)
      },
      showPrint() {
        var printer = new Printer()
        printer.isSupported().then(supported => {
          if (supported) {
            printer.printScreen().then(() => {
              this.$navigateBack()})
          } else {
            this.note("Printer is not supported")}
        })
      }
    }
}
</script>
<style lang="css">
</style>
