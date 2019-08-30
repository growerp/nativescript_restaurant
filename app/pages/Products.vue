<template lang="html">
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" plus="true" 
            :onActionTap="onAddTap" :openDrawer="openDrawer" header="product"/>
    </ActionBar>
    <StackLayout paddingTop="5">
      <RadListView ref="listView" for="item in itemList" @itemTap="onItemTap"
          @loaded="onLoaded">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*" class="item"
                paddingRight="5" paddingLeft="5">
            <Image :src="item.image"  col="0" class="thumbnail"/>
            <StackLayout col="1" paddingLeft="10">
              <label :text="item.name" class="h2"/>
              <label :text="item.categoryName" class="p"/>
            </StackLayout>
            <Label :text="item.price" class="p" col="2"/>
          </GridLayout>
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
  props: {
  },
  data () {
    return {
      itemList: [],
    }
  },
  
  methods: {
    onLoaded () {
      if (!this.itemList.length) {
        this.$backendService.getProductList().then( result => {
            this.itemList = result.data.products
            this.itemList.sort(function (a, b) {
              return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            });
        })
      }
    },
    onAddTap() { //get new item and insert sorted into list
        this.$showModal(ProductAdd, {   props: {},
              fullscreen: false,
              animated: true,
              stretched: false,
              dimAmount: 0.5})
        .then (result => {
          let inserted = false
          for (let i=0; i < this.itemList.length; i++) {
            if (this.itemList[i].name.toUpperCase() > result.name.toUpperCase()) {
              this.itemList.splice(i,0,result); inserted = true; break }}
          if(!inserted) this.itemList.push(result);
        })
    },
    onItemTap(args) {
        this.$navigateTo(this.$routes.ProductDetail,
            { props: {  list: this.itemList,
                        index: args.index}})
    },
  },
}
</script>

<style lang="css">
</style>
