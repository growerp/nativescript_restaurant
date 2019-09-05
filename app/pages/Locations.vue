<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
        <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" header="locations"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">
            <TabViewItem :title="$t('preparation')">
                <StackLayout>
                    <RadListView ref="listViewPreps" @loaded="onLoadedPrep"
                        for="prep in preps" @itemTap="onItemTap">
                        <v-template>
                            <GridLayout columns="50, *, auto" rows="*" class="item"
                                paddingRight="5" paddingLeft="5">
                                <Image :src="prep.image"
                                    col="0" class="thumbnail"/>
                                <label :text="prep.description" class="h2" col="1"
                                  padding="10"/>
                            </GridLayout>
                        </v-template>
                    </RadListView>
                </StackLayout>
            </TabViewItem>
            <TabViewItem :title="$t('tableAreas')">
                <StackLayout>
                    <RadListView ref="listView" @loaded="onLoadedArea"
                        for="area in areas"  @itemTap="onItemTap">
                        <v-template>
                            <GridLayout columns="50, *, auto" rows="*" class="item"
                                    paddingRight="5" paddingLeft="5">
                                <Image :src="area.image"
                                    col="0" class="thumbnail"/>
                                <label :text="area.description" class="h2" col="1"
                                  padding="10"/>
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
            text: 'Locations page',
            action: '',
            currentTab: 0,
            areas: [],
            preps: [],
            addText: ''
        }
    },
    created() {
        this.currentTab = this.startTab
    },
    methods: {
      onLoadedPrep() {
        if (!this.preps.length) {
          this.$backendService.getPreparationAreaList().then (result => {
              this.preps = result.data.preparationAreas})
        }
      },
      onLoadedArea() {
        if (!this.areas.length) {
          this.$backendService.getAccommodationAreaList().then (result => {
          this.areas = result.data.accommodationAreas})
        }
      },
        tabChange(args) {
            this.currentTab = args.value
            if (this.currentTab == 0) this.addText = this.$t('addPrepLoc')
            if (this.currentTab == 1) this.addText = this.$t('addTableArea')
        },
        onHeaderTap() {
          this.$navigateTo(this.$routes.Home)
        },
        onItemTap(args) {
          if (this.currentTab == 0) {
            this.$navigateTo(this.$routes.PrepDetail,
                { props: {  list: this.preps,
                            index: args.index}})}
          if (this.currentTab == 1) {
            this.$navigateTo(this.$routes.AreaDetail,
                { props: { list: this.areas,
                          index: args.index}})}
        },
        onAddTap() {
            if (this.currentTab == 0) {
              this.$showModal(PrepAdd).then (result => {
                let inserted = false
                for (let i=0; i < this.preps.length; i++) {
                  if (this.preps[i].description.toUpperCase() >
                      result.description.toUpperCase()) {
                    this.preps.splice(i,0,result); inserted = true; break }}
                if(!inserted) this.preps.push(result);
              })
            }
            if (this.currentTab == 1) {
              this.$showModal(AreaAdd).then (result => {
                let inserted = false
                for (let i=0; i < this.areas.length; i++) {
                  if (this.areas[i].description.toUpperCase() >
                      result.description.toUpperCase()) {
                    this.areas.splice(i,0,result); inserted = true; break }}
                if(!inserted) this.areas.push(result)})
            }
        },
    }
}
</script>

<style lang="css">
</style>
