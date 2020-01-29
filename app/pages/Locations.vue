<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
        <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer"
            header="locations"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" @selectedIndexChange="tabChange">
      <TabViewItem :title="$t('preparation')">
        <GridLayout rows="* ,50" padding="10">
          <RadListView for="item in preps" row="0"><!-- @itemTap not work on IOS -->
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto,10, auto" rows="*">
                    <label :text="$t('area') + ' ' + $t('name')"
                        col="1" class="h3"/>
                    <label :text="$t('printerIp')"
                        col="2" class="h3"/>
                    <label :text="$t('catg')"
                        col="4" class="h3"/>
                </GridLayout>
                <StackLayout class="hr-dark m-5"/>
              </StackLayout>
            </v-template>
            <v-template>
              <GridLayout columns="50, *, auto,10, auto" rows="*" class="p-5"
                  @tap="$navigateTo($routes.PrepDetail,{props: {item: Object.assign({},item)}})"
                  @longPress="onPrepAreaDeleteTap(item)">
                <Image :src="item.image" col="0"/>
                <label :text="item.description" class="h2 m-l-10" col="1"/>
                <label :text="item.printerIp" class="h3 m-l-10" col="2"/>
                <label :text="item.nbrOfCatg" class="h2" col="4"
                      :visibility="item.nbrOfCatg>0?'visible':'hidden'"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </GridLayout>
      </TabViewItem>
      <TabViewItem :title="$t('tableAreas')">
        <GridLayout rows="* ,50" padding="10">
          <RadListView for="item in areas" row="0">
            <v-template name="header">
              <StackLayout>
                <GridLayout columns="60, *, auto" rows="*">
                  <label :text="$t('area') + ' ' + $t('name')"
                      col="1" class="h3"/>
                  <label :text="$t('nbrOf') + $t('tables')"
                      col="2" class="h3"/>
                </GridLayout>
                <StackLayout class="hr-dark m-5"/>
              </StackLayout>
            </v-template>
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="p-5"
                  @tap="$navigateTo($routes.AreaDetail,{props:{item:Object.assign({},item)}})"
                  @longPress="onAccomAreaDeleteTap(item)">
                <Image :src="item.image" col="0"/>
                <label :text="item.description" class="h2 m-l-10" col="1"/>
                <label :text="item.nbrOfSpots" class="h2" col="2" 
                    :visibility="item.nbrOfSpots>0?'visible':'hidden'"/>
              </GridLayout>
            </v-template>
          </RadListView>
        </GridLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import AreaAdd from './modalPages/AreaAdd'
import PrepAdd from './modalPages/PrepAdd'
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'

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
    onAddTap() {
      if (this.currentTab == 0) { this.$showModal(PrepAdd)}
      if (this.currentTab == 1) { this.$showModal(AreaAdd)}
    },
    onPrepAreaDeleteTap(item) {
      if (item.nbrOfCatg) {
        this.note(this.$t('cannotDelPrep'))
      } else {
        this.$showModal(Confirm,{ props: {
          message: this.$t('delPrepArea') + item.description + " ?"}
        })
        .then (result => {
          if (result) {
            this.$store.dispatch('deletePreparationArea',
                item.preparationAreaId)
            this.preps = this.$store.getters.preparationAreas
          }
        })
      }
    },
    onAccomAreaDeleteTap(item) {
      this.$showModal(Confirm,{ props: {
          message: "Delete table area " + item.description + " ?"}
      }).then (data => {
        if (data) {
          this.$store.dispatch('deleteAccommodationArea',
                item.accommodationAreaId)
        }
      })
    },
  }
}
</script>

<style lang="css">
</style>
