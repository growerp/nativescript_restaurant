<template lang="html">
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" header="product"/>
    </ActionBar>
    <GridLayout rows="*, 50" padding="10">
      <RadListView for="item in itemList" row="0">
        <v-template name="header">
          <GridLayout columns="50, *, auto" rows="*">
            <StackLayout col="1">
              <label text="Product Name" class="p"/>
              <label text="Category Name" class="p"/>
            </StackLayout>
            <label text="Price" col="3" class="p"/>
          </GridLayout>
        </v-template>
        <v-template>
          <GridLayout columns="50, *, auto" rows="*"
                @tap="$navigateTo($routes.ProductDetail,
                        {props: {item: Object.assign({},item)}})"
                @longPress="onDeleteTap(item)">
            <Image :src="item.image"  col="0" height="50"/>
            <StackLayout col="1" paddingLeft="5">
              <label :text="item.name" class="h2"/>
              <label :text="item.categoryName" class="p"/>
            </StackLayout>
            <Label :text="item.price" class="p" col="2"/>
          </GridLayout>
        </v-template>
        <v-template name="footer">
          <Label :text="'Total products: ' + itemList.length"/>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import ProductAdd from './modalPages/ProductAdd'
import Confirm from './modalPages/Confirm'
import general from '~/mixins/general'

export default {
  name: 'products',
  mixins: [ sideDrawer, general ],
  data () {
    return {
      itemList: this.$store.getters.products,
    }
  },
  methods: {
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(ProductAdd)
    },
    onDeleteTap(item) {
      this.$showModal(Confirm,{ props: {
          message: this.$t('delProduct') + item.name + "?"}
      })
      .then (data => {
        if (data) {
          this.$backendService.deleteProduct(item.productId)
          this.$store.commit('product', {
            verb: 'delete',
            productId: item.productId })
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
