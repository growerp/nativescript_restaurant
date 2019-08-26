<template lang="html">
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *, auto">
        <Image src="~/assets/images/menu.png" height="20" @tap="openDrawer()" col="0"/>
        <StackLayout orientation="horizontal" @tap="$navigateTo($routes.SetUp)" col="1"
            horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          <Label class="title" :text="$t('categories')"/>
        </StackLayout>
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
              <Label :text="item.categoryName" class="h2" col="1"
                  padding="10"/>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import CategoryAdd from './modalPages/CategoryAdd'

export default {
  name: 'Categories',
  mixins: [ sideDrawer],
  data () {
    return {
      itemList: [],
    }
  },
  methods: {
    onLoaded () {
      if (!this.itemList.length) {
        this.$backendService.getCategoryList().then( result => {
            this.itemList = result.data.categories
            this.itemList.sort(function (a, b) {
              return a.categoryName.toLowerCase().
                localeCompare(b.categoryName.toLowerCase())
            });
        })
      }
    },
    onAddTap() { //get new item and insert sorted into list
      this.$showModal(CategoryAdd).then (result => {
        let inserted = false
        for (let i=0; i < this.itemList.length; i++) {
          if (this.itemList[i].categoryName.toUpperCase() >
              result.categoryName.toUpperCase()) {
            this.itemList.splice(i,0,result); inserted = true;break }}
        if(!inserted) this.itemList.push(result);
      })
    },
    onItemTap(args) {
        this.$navigateTo(this.$routes.CategoryDetail,
            { props: {  list: this.itemList, index: args.index}})
    },
  },
}
</script>

<style lang="css">
</style>
