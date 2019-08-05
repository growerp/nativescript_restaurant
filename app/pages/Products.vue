<template lang="html">
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
        <GridLayout columns="auto,auto" @tap="$navigateTo($routes.SetUp)" col="1"
              horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" col="0" height="20"/>
          <Label class="title" :text="$t('product')" col="1"/>
        </GridLayout>
        <Label @tap="onAddTap" :text="$t('add')" col="2"/>
      </GridLayout>
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
export default {
  name: 'products',
  mixins: [ sideDrawer ],
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
        this.$showModal(ProductAdd).then (result => {
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
