<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back=true :plus="true" 
            :onActionTap="onAddTap" header="product"/>
    </ActionBar>
    <GridLayout rows="*" padding="10">
      <RadListView for="item in itemList" row="0">
        <v-template name="header">
            <GridLayout columns="60, *, auto" rows="*" background="#00CAAB">
              <Image src="~/assets/images/search.png" 
                width="30" col="0" @tap="searchTap"/>
              <StackLayout col="1">
                <label :text="$t('product') + ' ' + $t('name')"
                    class="h3"/>
                <label :text="$t('category') + ' ' + $t('name')"
                    class="h4"/>
              </StackLayout>
              <label :text="$t('price')" col="2" class="h4"/>
             </GridLayout>
        </v-template>
        <v-template>
          <GridLayout columns="50, *, auto" rows="*"
                @tap="$navigateTo($routes.ProductDetail,
                        {props: {item: Object.assign({},item)}})"
                @longPress="onDeleteTap(item)">
            <Image :src="item.image"  col="0" height="40"/>
            <StackLayout col="1" class="m-l-10">
              <label :text="item.name" class="h3"/>
              <label :text="item.categoryName" class="h4"/>
            </StackLayout>
            <Label :text="item.price" class="h3" col="2"/>
          </GridLayout>
        </v-template>
        <v-template name="footer">
          <Label :text="'Total products: ' + itemList.length" class="footnote"/>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>

import ProductAdd from './modalPages/ProductAdd'
import Confirm from './modalPages/Confirm'
import Search from './modalPages/Search'
import general from '~/mixins/general'

export default {
  name: 'products',
  mixins: [  general ],
  data () {
    return {
      itemList: this.$store.getters.products,
    }
  },
  methods: {
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(ProductAdd)
    },
    searchTap() {
      this.$showModal(Search,{ props: {
          message: 'productSearch', item: {name: ''}}
      })
      .then (data => {
        if (data) 
          this.itemList = this.$store.getters.productsSearchName(data.name)
      })
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
