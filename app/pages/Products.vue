<template lang="html">
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" header="product"/>
    </ActionBar>
    <StackLayout padding="10">
      <RadListView for="item in itemList" @itemTap="onItemTap">
        <v-template name="header">
          <GridLayout columns="50, *, *, auto" rows="*">
            <StackLayout col="1">
              <label text="Product Name"/>
              <label text="Category Name"/>
            </StackLayout>
            <label text="Price" col="3"/>
          </GridLayout>
        </v-template>
        <v-template>
          <GridLayout columns="50, *, *, auto" rows="*">
            <Image :src="item.image"  col="0" height="50"/>
            <StackLayout col="1" paddingLeft="5">
              <label :text="item.name" class="h2"/>
              <label :text="item.categoryName" class="p"/>
            </StackLayout>
            <Label :text="item.price" class="p" col="3"/>
          </GridLayout>
        </v-template>
        <v-template name="footer">
          <Label :text="'Total products: ' + itemList.length"/>
        </v-template>
      </RadListView>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import ProductAdd from './modalPages/ProductAdd'
import general from '~/mixins/general'

export default {
  name: 'products',
  mixins: [ sideDrawer, general ],
  data () {
    return {
      itemList: this.$store.getters.products
    }
  },
  
  methods: {
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(ProductAdd)
    },
    onItemTap(args) {
      this.$navigateTo(this.$routes.ProductDetail,
            { props: {  item: Object.assign({},args.item)}})
    },
  },
}
</script>

<style lang="css">
</style>
