<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back="true"
          header="inProcess"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange"
          style="tabTextColor: lightGreen;selectedTabTextColor: green;"
             paddingTop="10">
      <!-- create a list for every preparation area -->
      <TabViewItem v-for="(prep, index) in this.prepAreas"
          :key="index" :col="index" :title="prep.description">
        <GridLayout rows="*,auto" class="p-10">
          <Accordion allowMultiple="false" height="100%" row="0"
              for="item of $store.getters.openOrdersByPrepId(
                prep.preparationAreaId)"  childItems="items"
              :visibility="$store.getters.preparationAreaHasOrders(
                prep.preparationAreaId)? 'visible' : 'collapse'">
            <v-template name="title">
              <GridLayout columns="50,150,*" rows="*" paddingBottom="10">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <StackLayout paddingLeft="10" col="1">
                  <Label :text="item.table" class="h2"/>
                  <Label :text="item.nbrOfItems + ' ' + $t('items')" class="h3"
                      :visibility="item.statusId!='OrderApproved'?'visible':'collapsed'"/>
                  <Label :text="$t('totalAmount') + ': ' + item.grandTotal" class="h3"  
                      :visibility="item.statusId=='OrderApproved'?'visible':'collapsed'"/>
                </StackLayout>
                <!-- cannot use Button here so use cleckable label, otherwise accordeon will not expand -->
                <Label @tap="rePrint(item)" col="2" :text="$t('rePrint')" padding="10" class="labelpr"
                    :visibility="item.statusId!='OrderApproved'?'visible':'hidden'"/>
                <GridLayout col="2" columns="*,*,*"
                    :visibility="item.statusId=='OrderApproved'?'visible':'hidden'">
                    <Label :text="$t('cancel')" col=0 @tap="setCancel(item)" class="labelpr"/>
                    <Label :text="$t('rePrint')" col=1 @tap="rePrint(item)" class="labelpr"/>
                    <Label :text="$t('done')" col=2 @tap="setDone(item)"  class="labelpr"/>
                </GridLayout>
              </GridLayout>
            </v-template>
            <v-template name="content">
              <GridLayout columns="50, *, 30, 70, 70" rows="*" class="item"
                  paddingRight="5" paddingLeft="25" >
                <Image :src="item.image"  col="0" class="thumbnail" height="30"/>
                <Label :text="item.description" class="h3" col="1"/>
                <Label :text="item.quantity" class="h3" col="2" paddingRight="10"/>
                <Label :text="item.price" class="h3" col="3" paddingRight="10"/>
                <Label :text="item.totalAmount" class="h3" col="4"/>
              </GridLayout>
            </v-template>
          </Accordion>
          <GridLayout columns="*" rows="*" row="0"
              :visibility="$store.getters.preparationAreaHasOrders(
                prep.preparationAreaId)? 'collapse' :'visible'">
            <Label class="message" col="0" row="0"
                :text="$t('noOrdersToPrepare') + prep.description"/>
          </GridLayout>
          <Button :text="$t('refresh')" @tap="refresh"
                    width="50%" row="1"/>
        </GridLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>

import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'
import { isIOS, isAndroid } from 'tns-core-modules/platform';

export default {
  name: 'inProcess',
  mixins: [  general ],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: 0,
      prepAreas: this.$store.getters.preparationAreas,
    }
  },
  created() {
    this.prepAreas.forEach((area,index) => {
      if (area.preparationAreaId == this.$store.getters.billingArea.preparationAreaId)
        this.currentTab = index
    })
  },
  methods: {
    tabChange(args) {
        this.currentTab = args.value
    },
    rePrint(item) {
      let result = ''
      if (item.statusId == 'OrderApproved') {
        result = this.$printService.receiptTicket(item.orderId)
      } else {
        result = this.$printService.prepareTicket([item])
      }
      if (result) {
        this.$showModal(Confirm,{ props: {
            message: result + "\n Define printer?" }})
        .then(response => {
          if (response) {
            let prep = this.$store.getters.preparationAreaById(item.preparationAreaId)
            this.$navigateTo(this.$routes.PrepDetail, {props: { item: prep }})
          }
        })
      }
    },
    setDone(item) {
      this.$store.dispatch('orderStatus', { spotId: item.spotId,
        statusId: 'OrderCompleted', orderId: item.orderId})
      this.note(this.$t('table') + ' ' + item.table + this.$t('isNowPaid'))
    },
    setCancel(item) {
      this.$store.dispatch('orderStatus', { spotId: item.spotId,
        statusId: 'OrderCancelled', orderId: item.orderId}) 
      this.note(this.$t('table') + ' ' + item.table + this.$t('cancelled'))
    },
    refresh() {
      this.$store.dispatch('getOpenOrders')
    }
  },
}
</script>

<style lang="css">
  label.labelpr {
    background-color: #00CAAB;
    border-radius: 20;
    height: 40;  
    text-align: center;
    padding-top: 10;
    }
</style>
