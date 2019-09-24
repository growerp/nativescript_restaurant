<template lang="html">
  <Page @loaded="pageLoaded(0)">
    <ActionBar>
      <GridLayout columns="auto, *, auto">
        <Label class="title" text="BACK" col="0" @tap="$navigateBack"/>
        <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)" col="1"
            horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          <Label class="title" :text="$t('orderExtraInformation')"/>
        </StackLayout>
      </GridLayout>
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
            text: 'Order Page',
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
        console.log('committed object:' + data.object.editedObject)
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
