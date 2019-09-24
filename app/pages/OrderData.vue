<template lang="html">
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back="true"
          :openDrawer="openDrawer" :headerNoI18n="header"/>
    </ActionBar>
    <GridLayout rows="*,50,50">
      <RadDataForm :source="orderHeaderInfo" :metadata="orderHeaderInfoMeta"
          @propertyCommitted="onHeaderCommitted" row="0" height="80%"/>
      <Button class="button" :text="$t('continue')" @tap="goToEntry"
        row="1" width="50%"/>
    </GridLayout>
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
    orderHeader: {}
  },
  data () {
    return {
      header: this.$t('orderExtraInformation') + ' ' + this.$t('orderFor') + 
          this.$t('table') + this.orderHeader.description +
          '-' + this.orderHeader.spotNumber,
      currentTab: 0,
      editedOrderHeader: {},
      orderHeaderInfo: {
        newExternalId: '',
        externalId: '',
        nbrOfGuests: '',
      },
      orderHeaderInfoMeta: {
        propertyAnnotations:[
          { name: 'newExternalId', displayName: this.$t('new') + this.$t('customerId') + ' + ' + this.$t('lastName'),
              index: 0},
          { name: 'externalId', displayName: this.$t('existing') + this.$t('customerId'),
              editor: 'AutoCompleteInline',
              editorParams: {
              autoCompleteDisplayMode: AutoCompleteDisplayMode.Plain},
              valuesProvider: this.$store.getters.customerProvider,
              index: 1},
          { name: 'nbrOfGuests', displayName: this.$t('nbrOfGuests'),
              editor: 'Number', index: 2 },
          ]
      },
    }
  },
  methods: {
    onHeaderCommitted(data) {
      this.editedOrderHeader = JSON.parse(data.object.editedObject)
    },
    goToEntry() {
      if (this.editedOrderHeader.externalId && this.editedOrderHeader.newExternalId) {
        this.note(this.$t('eitherNewOrExistingCustomerId'))
      } else {
        this.hideKeyboard()
        for (var key in this.editedOrderHeader) {
          if (this.editedOrderHeader.hasOwnProperty(key))
                this.orderHeader[key] = this.editedOrderHeader[key]}
        this.$navigateTo(this.$routes.OrderEntry,
          {props: { orderHeader: this.orderHeader }})
      }
    },
  }
}
</script>

<style lang="css">
</style>
