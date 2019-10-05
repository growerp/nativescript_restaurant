<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer"
          header="categoryDetail"/>
    </ActionBar>
    <GridLayout rows="auto, auto, auto, *, auto, 50">
      <GridLayout width="100%" columns="100,30,*" rows="50,50"
              padding="20" row="0">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('category', item.productCategoryId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('category', item.productCategoryId)"/>
      </GridLayout>
      <RadDataForm ref="itemForm" :source="item" row="1"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="h4" :text="$t('products') + $t('tapToMove')"
          row="2" paddingLeft="20"/>
      <RadListView ref="listView" for="item in productList" row="3">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*" padding="10"
              @tap="onMoveItemTap(item)" @longPress="onDeleteItemTap(item)">
              <Image :src="item.image"  col="0" height="40"/>
              <label :text="item.name" class="h2" col="1"/>
              <label :text="item.price" class="h3" col="2"/>
            </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addProduct')" @tap="addProduct" 
                row="4" width="50%"/>
    </GridLayout>
  </Page>
</template>

<script>
  import sideDrawer from '~/mixins/sideDrawer'
  import imageSelector from '~/mixins/imageSelector'
  import ProdCategoryMove from './modalPages/ProdCategoryMove'
  import ProductAdd from './modalPages/ProductAdd'
  import Confirm from './modalPages/Confirm'
  import general from '~/mixins/general'
  const platformModule = require("tns-core-modules/platform")
  export default {
    name: 'CategoryDetail',
    mixins: [ imageSelector,general, sideDrawer ],
    props: {
      item: Object,
    },
    data() {
      return {
        productList: this.$store.getters.productsByCatg(this.item.productCategoryId),
        editedItem: null,
        prepAreas: this.$store.getters.preparationAreasDesc(false),
        itemMeta: {
          propertyAnnotations: [
              { name: 'productCategoryId', ignore: true},
              { name: 'image', ignore: true},
              { name: 'categoryName', required: true, index: 0},
              { name: 'preparationAreaId', ignore: true},
              { name: 'description', required: true, index: 1, displayName: this.$t('preparation'),
                editor: 'Picker', valuesProvider: this.$store.getters.preparationAreasDesc(false)},
              { name: 'nbrOfProducts', ignore: true}]},
      }
    },
    created() {
      this.$backendService.downloadImage('medium', 'category',
          this.item.productCategoryId)
      .then(result => { this.itemImage = result.data.imageFile})
      if (platformModule.isIOS) { // returns an index instead of value so change
        this.item.description = this.prepAreas.findIndex(
            o => o === this.item.description)}
    },
    methods: {
      onItemCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
      },
      onMoveItemTap(item) {
        this.$showModal(ProdCategoryMove, { props: {product: item}})
        .then(() => {
          this.refresh()
        })
      },
      onSaveTap() {
        if (this.editedItem) {
          if (!this.editedItem.categoryName) this.note(this.$t('nameIsRequired'))
          else {
            if (platformModule.isIOS) { // returns an index instead of value so change
              this.editedItem.description = 
                  this.prepAreas[parseInt(this.editedItem.description,10)]}
            this.editedItem.preparationAreaId =
              this.$store.getters.preparationAreaByDesc(
                  this.editedItem.description).preparationAreaId 
            this.$backendService.updateCategory(this.editedItem)
            this.editedItem.verb = 'update'
            this.$store.commit('productCategory',this.editedItem)
            this.hideKeyboard()
          }
        }
        this.$navigateBack()
      },
      onDeleteItemTap(item) {
        this.$showModal(Confirm,{ props: {
          message: this.$t('delProduct') + item.name + "?"}
        })
        .then (data => {
          if (data) {
            this.$backendService.deleteProduct(item.productId)
            this.$store.commit('product', {
                  verb: 'delete',
                  productId: item.productId,
                  productCategoryId: item.productCategoryId})
            this.refresh()
          }
        })
      },
      addProduct() {
        this.$showModal(ProductAdd, { props: {categoryName: this.item.categoryName}})
        .then(() => {
          this.refresh()
        })
      },
      refresh() {
          this.productList = this.$store.getters.productsByCatg(
            this.item.productCategoryId)
      }
    }
  }
</script>
