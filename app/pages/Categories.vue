<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" header="categories"/>
    </ActionBar>
    <StackLayout padding="10">
      <RadListView for="item in itemList" @itemTap="onItemTap" height="100%">
          <v-template name="header">
            <GridLayout columns="50, 10, *, auto" rows="*" padding="5">
              <StackLayout col="2">
                <label text="categoryName"/>
                <label text="prepareArea"/>
              </StackLayout>
              <label text="nbrOfProducts" col="3"/>
            </GridLayout>
          </v-template>
          <v-template>
            <GridLayout columns="50, 10, *, auto, 10, auto" rows="*" padding="5">
              <Image :src="item.image"  col="0" height="50"/>
              <StackLayout col="2">
                <Label :text="item.name" class="h2"/>
                <Label :text="item.description" class="h3"/>
              </StackLayout>
              <Label :text="item.nbrOfProducts" class="h3" col="3"/>
            </GridLayout>
          </v-template>
          <v-template name="footer">
            <Label :text="'Total categories: ' + itemList.length"/>
          </v-template>
        </RadListView>
      </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import CategoryAdd from './modalPages/CategoryAdd'
import general from '~/mixins/general'
import ProductAdd from './modalPages/ProductAdd'

export default {
  name: 'Categories',
  mixins: [ sideDrawer, general],
  data () {
    return {
      itemList: this.$store.getters.categoriesAndProductsCount,
    }
  },
  methods: {
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(CategoryAdd)
      .then (() => {
        this.itemList = this.$store.getters.categoriesAndProductsCount
      })
    },
    onItemTap(args) {
      this.$navigateTo(this.$routes.CategoryDetail,
          { props: { index: args.index}})
      .then (() => {
        this.itemList = this.$store.getters.categoriesAndProductsCount
      })
    },
  },
}
</script>

<style lang="css">
</style>
