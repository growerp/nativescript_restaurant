<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="inProcess"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange"
             paddingTop="10">
      <!-- create a list for every preparation area -->
      <TabViewItem v-for="(prep, index) in this.prepAreas"
          :key="index" :col="index" :title="prep.description">
        <GridLayout rows="*,auto,50" class="p-10">
          <Accordion allowMultiple="false" height="100%" row="0"
              for="item of $store.getters.openOrdersByPrepId(
                prep.preparationAreaId)"  childItems="items"
              :visibility="$store.getters.preparationAreaHasOrders(
                prep.preparationAreaId)? 'visible' : 'collapse'">
            <v-template name="title">
              <GridLayout columns="50,*,auto" rows="*" paddingBottom="10">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <StackLayout paddingLeft="10" col="1">
                  <Label :text="item.table" class="h2"/>
                  <Label :text="item.nbrOfItems + ' ' + $t('items')" class="h3"
                      :visibility="item.statusId!='OrderApproved'?'visible':'collapsed'"/>
                  <Label :text="$t('totalAmount') + ': ' + item.grandTotal" class="h3"  
                      :visibility="item.statusId=='OrderApproved'?'visible':'collapsed'"/>
                </StackLayout>
                <Label class="button" @tap="rePrint(item)"
                    col="2" :text="$t('rePrint')" padding="10"
                    :visibility="item.statusId!='OrderApproved'?'visible':'hidden'"/>
                <StackLayout orientation="horizontal" col="2"
                    :visibility="item.statusId=='OrderApproved'?'visible':'hidden'">
                    <Label class="button" :text="$t('cancel')"
                        @tap="setCancel(item)" padding="10"/>
                    <Label class="button" :text="$t('rePrint')"
                        @tap="rePrint(item)" padding="10"/>
                    <Label class="button" :text="$t('done')"
                        @tap="setDone(item)" padding="10"/>
                </StackLayout>
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
          <Button class="button" :text="$t('refresh')" @tap="refresh"
                    width="50%" row="1"/>
        </GridLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'

export default {
  name: 'inProcess',
  mixins: [ sideDrawer, general ],
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
</style>
