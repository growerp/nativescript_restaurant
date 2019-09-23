<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="preparation"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange"
             paddingTop="10">
      <!-- create a list for every preparation area -->
      <TabViewItem v-for="(prep, index) in this.prepAreas"
          :key="index" :col="index" :title="prep.description">
        <StackLayout>
          <Accordion row="1" col="0" colSpan="3" allowMultiple="false" height="80%"
                  for="item of prepOrders[index]"  childItems="items">
                  <!--:visibility="prepOrders[index]? 'visible' : 'collapse'"-->
            <v-template name="title">
              <GridLayout columns="50,*,80" rows="*" paddingLeft="10">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <Label :text="item.description + '-' +
                    item.spotNumber + '   ' + item.nbrOfItems + ' ' + $t('items')" 
                    class="h2" col="1" paddingLeft="10"/>
                <Label class="button" @tap="setDone(item, prep, index)"
                    col="2" :text="$t('done')" text-align="center"/>
              </GridLayout>
            </v-template>
            <v-template name="content">
                <GridLayout columns="50, *, auto" rows="*" class="item"
                        paddingRight="5" paddingLeft="25" >
                  <Image :src="item.image"  col="0" class="thumbnail"/>
                  <Label :text="item.itemDescription" class="h2" col="1"/>
                  <Label :text="item.quantity" class="h2" col="2"/>
                </GridLayout>
            </v-template>
          </Accordion>
          <Button class="button" :text="$t('refresh')" @tap="refresh(index)"
                    width="50%"/>
          <GridLayout columns="*" rows="*"
              :visibility="prepOrders[index]? 'collapse':'visible'">
            <Label class="message" col="0" row="0"
                :text="$t('noOrdersToPrepare') + prep.description"/>
          </GridLayout>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'

export default {
  name: 'prepare',
  mixins: [ sideDrawer, general ],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: 0,
      prepAreas: this.$store.getters.preparationAreas,
      prepOrders: [],
    }
  },
  created() {
    this.currentTab = this.startTab
    for (let i=0;i < this.prepAreas.length;i++) {
      this.$backendService.getOrdersAndItems('prep',
            this.prepAreas[i].preparationAreaId)
      .then( result => {
        console.log('=====oders and items for ' + this.prepAreas[i].description + JSON.stringify(result.data.ordersAndItems))
        this.prepOrders[i] = result.data.ordersAndItems
        this.currentTab = 100;this.currentTab = i
      })
    }
  },
  methods: {
    tabChange(args) {
        this.currentTab = args.value
    },
    setDone(item, prep, index) {
      this.$backendService.changeOrderPartStatus(
          item.orderId, item.orderPartSeqId, 'serv')
      .then(() =>{ this.refresh(index) })
      this.note(this.$t('table') + ' ' + item.description + '-' +
            item.spotNumber + this.$t('isReadyToServeFrom') + prep.description)
    },
    refresh(areaIndex) {
      this.$backendService.getOrdersAndItems('prep',
            this.prepAreas[areaIndex].preparationAreaId)
      .then( result => {
        this.prepOrders[areaIndex] = result.data.ordersAndItems
        this.currentTab = 100;this.currentTab = areaIndex})
    }
  },
}
</script>

<style lang="css">
</style>
