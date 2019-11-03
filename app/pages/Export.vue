<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :back="true"
          :openDrawer="openDrawer" 
          header="export"/>
    </ActionBar>
    <StackLayout padding="20">
      <Button class="button" text="Export Orders" 
        width="50%" @tap="orders"/>
      <Button class="button" text="Export Customers" 
        width="50%" @tap="customers"/>
      <Button class="button" text="Export Categories &amp; products" 
        width="50%" @tap="catgsProducts"/>
    </StackLayout>
</Page>
</template>

<script>
import general from '~/mixins/general'
import sideDrawer from '~/mixins/sideDrawer'

export default {
  name: 'Export',
  mixins: [ sideDrawer, general ],
  methods: {
    orders() {
      this.$backendService.exportOrders(null) // add start date later
      this.note(this.$t('JobStarted'))
    },
    customers() {
      this.$backendService.exportCustomers()
      this.note(this.$t('JobStarted'))
    },
    catgsProducts() {
      this.$backendService.exportCatgsProducts()
      this.note(this.$t('JobStarted'))
    }
  }
}
</script>

<style lang="css">

</style>
