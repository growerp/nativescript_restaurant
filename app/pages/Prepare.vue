<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout width="100%" columns="auto, *, auto">
        <Label @tap="openDrawer()" col="0" :text="$t('menu')"/>
        <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)" col="1"
            horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          <Label class="title" :text="$t('preparation')"/>
        </StackLayout>
      </GridLayout>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange"
             paddingTop="10">
            <!-- create a list for every preparation area -->
            <TabViewItem v-for="(prep, index) in this.prepAreasAndCategories"
                :key="index" row="0" :col="index" :title="prep.description">
              <StackLayout>
                <Button class="button" :text="$t('refresh')" @tap="refresh(index)"/>
                <Accordion row="1" col="0" colSpan="3" allowMultiple="false" height="100%"
                        for="item of prepOrders[index]"  childItems="items"
                        :visibility="prepOrders[index][0]? 'visible' : 'collapse'">
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
                <GridLayout columns="*" rows="*"
                    :visibility="prepOrders[index][0]? 'collapse':'visible'">
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
            prepAreasAndCategories: this.$store.getters.prepAreasAndCategories,
            prepOrders: [{},[{}]],
          }
    },
    created() {
      this.currentTab = this.startTab
      for (let i=0;i < this.prepAreasAndCategories.length;i++) {
        this.$backendService.getOrdersAndItems('prep',
              this.prepAreasAndCategories[i].preparationAreaId)
        .then( result => {
          this.prepOrders[i] = result.data.ordersAndItems
          this.currentTab = 100;this.currentTab = i
        })
      }
    },
    methods: {
        tabChange(args) {
            this.currentTab = args.value
            this.createBanner()
        },
        onHeaderTap() {
          this.$navigateTo(this.$routes.Home)
        },
        setDone(item, prep, index) {
            this.$backendService.changeOrderPartStatus(
                item.orderId, item.orderPartSeqId, 'serv')
            .then(() =>{ this.refresh(index) })
            this.note(this.$t('table') + ' ' + item.description + '-' +
                  item.spotNumber + this.$t('isReadyToServeFrom') + prep.description)
        },
        refresh(area) {
          this.$backendService.getOrdersAndItems('prep',
                this.prepAreasAndCategories[area].preparationAreaId)
          .then( result => {
            this.prepOrders[area] = result.data.ordersAndItems
            this.currentTab = 100;this.currentTab = area})
        }
   },
}
</script>

<style lang="css">
</style>
