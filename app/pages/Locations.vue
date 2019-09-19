<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
        <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" :header="$t('locations')"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange">
      <TabViewItem :title="$t('preparation')">
        <StackLayout>
          <RadListView for="item in preps" @itemTap="onItemTap">
            <v-template name="header">
              <GridLayout columns="80, *, auto" rows="*" padding="10">
                  <label text="Area Name" col="1" class="p"/>
                  <label text="Categories" col="2" class="p"/>
              </GridLayout>
            </v-template>
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" padding="10">
                <Image :src="item.image" col="0" class="thumbnail"/>
                <label :text="item.description" class="h2" col="1" paddingLeft="10"/>
                <label :text="item.nbrOfCatg" class="h2" col="2"
                      :visibility="item.nbrOfCatg>0?'visible':'hidden'"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </StackLayout>
      </TabViewItem>
      <TabViewItem :title="$t('tableAreas')">
        <StackLayout>
            <RadListView for="item in areas"  @itemTap="onItemTap">
            <v-template name="header">
              <GridLayout columns="80, *, auto" rows="*" padding="10">
                  <label text="Area Name" col="1" class="p"/>
                  <label text="Tables" col="2" class="p"/>
              </GridLayout>
            </v-template>
              <v-template>
                <GridLayout columns="50, *, auto" rows="*"  padding="10">
                  <Image :src="item.image" col="0" class="thumbnail"/>
                  <label :text="item.description" class="h2" col="1" paddingLeft="10"/>
                  <label :text="item.nbrOfSpots" class="h2" col="2" 
                      :visibility="item.nbrOfSpots>0?'visible':'hidden'"/>
                </GridLayout>
              </v-template>
            </RadListView>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import AreaAdd from './modalPages/AreaAdd'
import PrepAdd from './modalPages/PrepAdd'
import general from '~/mixins/general'

export default {
  name: 'Locations',
  mixins: [ sideDrawer, general ],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: 0,
      areas: this.$store.getters.accommodationAreas,
      preps: this.$store.getters.preparationAreas,
    }
  },
  created() {
      this.currentTab = this.startTab
  },
  methods: {
    tabChange(args) {
      this.currentTab = args.value
    },
    onItemTap(args) {
      if (this.currentTab == 0) {
        this.$navigateTo(this.$routes.PrepDetail,
            { props: {  item: args.item}})}
      if (this.currentTab == 1) {
        this.$navigateTo(this.$routes.AreaDetail,
            { props: { item: args.item}})}
    },
    onAddTap() {
      if (this.currentTab == 0) {
        this.$showModal(PrepAdd)
      }
      if (this.currentTab == 1) {
        this.$showModal(AreaAdd)
      }
    },
  }
}
</script>

<style lang="css">
</style>
