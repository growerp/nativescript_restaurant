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
              for="item of $store.getters.preparationAreaOrdersById(
                prep.preparationAreaId)"  childItems="items"
              :visibility="$store.getters.preparationAreaHasOrders(
                prep.preparationAreaId)? 'visible' : 'collapse'">
            <v-template name="title">
              <GridLayout columns="50,*,auto" rows="*" paddingBottom="10">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <Label :text="item.description + '-' +
                    item.spotNumber + '   ' + item.nbrOfItems + ' ' + $t('items')" 
                    class="h2" col="1" paddingLeft="10"/>
                <Label class="button" @tap="rePrint(item)"
                    col="2" :text="$t('rePrint')" padding="10"/>
              </GridLayout>
            </v-template>
            <v-template name="content">
                <GridLayout columns="30, 10, *, auto" rows="*" class="item"
                        paddingRight="5" paddingLeft="25" >
                  <Image :src="item.image"  col="0" class="thumbnail"/>
                  <Label :text="item.description" class="h3" col="2"/>
                  <Label :text="item.quantity" class="h3" col="3"/>
                </GridLayout>
            </v-template>
          </Accordion>
          <Button class="button" :text="$t('refresh')" @tap="refresh"
                    width="50%" row="1"/>
          <GridLayout columns="*" rows="*" row="0"
              :visibility="$store.getters.preparationAreaHasOrders(
                prep.preparationAreaId)? 'collapse' :'visible'">
            <Label class="message" col="0" row="0"
                :text="$t('noOrdersToPrepare') + prep.description"/>
          </GridLayout>
        </GridLayout>
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
    }
  },
  methods: {
    tabChange(args) {
        this.currentTab = args.value
    },
    rePrint(item) {
      let result = this.$printService.prepareTicket(item)
      if (result)  console.log("printer error: " + result)
    },
    refresh() {
      this.$store.dispatch('getOrders', null)
    }
  },
}
</script>

<style lang="css">
</style>
