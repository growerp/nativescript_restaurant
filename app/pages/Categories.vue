<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back=true :plus="true" 
            :onActionTap="onAddTap" header="categories"/>
    </ActionBar>
      <RadListView for="item in itemList" height="100%" row="0">
          <v-template name="header">
            <StackLayout>
              <GridLayout columns="60, *, auto" rows="*">
                <StackLayout col="1">
                  <label :text="$t('category') + ' ' + $t('name')"
                      class="h3"/>
                  <label :text="$t('preparation')"
                      class="h3"/>
                </StackLayout>
                <label :text="$t('nbrOf') + $t('products')"
                        col="2" class="h3"/>
              </GridLayout>
              <StackLayout class="hr-dark m-5"/>
            </StackLayout>
          </v-template>
          <v-template>
            <GridLayout columns="50, 10, *, auto, 10, auto" rows="*" 
                @tap="$navigateTo($routes.CategoryDetail,
                      {props: {item: Object.assign({},item)}})"
                @longPress="onDeleteTap(item)">
              <Image :src="item.image"  col="0" height="50"/>
              <StackLayout col="2">
                <Label :text="item.categoryName" class="h2"/>
                <Label :text="item.description" class="h3"/>
              </StackLayout>
              <Label :text="item.nbrOfProducts" class="h3" col="3"/>
            </GridLayout>
          </v-template>
          <v-template name="footer">
            <Label :text="'Total categories: ' + itemList.length"/>
          </v-template>
      </RadListView>
  </Page>
</template>

<script>

import CategoryAdd from './modalPages/CategoryAdd'
import Confirm from './modalPages/Confirm'
import general from '~/mixins/general'
import ProductAdd from './modalPages/ProductAdd'

export default {
  name: 'Categories',
  mixins: [  general],
  data () {
    return {
      itemList: this.$store.getters.productCategories,
    }
  },
  methods: {
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(CategoryAdd)
    },
    onDeleteTap(item) { //delete Item
      if (item.nbrOfProducts != "0") {
        this.note(this.$t('cannotDelCatProd'))
      } else {
        this.$showModal(Confirm,{ props: {
            message: this.$t('deleteCategory') + item.categoryName + "?"}
        })
        .then (data => {
          if (data) {
            this.$store.dispatch('deleteProductCategory', item.productCategoryId)
          }
        })
      }
    },
  },
}
</script>

<style lang="css">
</style>
