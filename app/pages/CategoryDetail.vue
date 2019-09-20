<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="categoryDetail"/>
    </ActionBar>
    <StackLayout>
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('category', item.productCategoryId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('category', item.productCategoryId)"/>
      </GridLayout>
      <RadDataForm ref="itemForm" :source="item"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="title" :text="$t('products') + $t('tapToMove')"/>
      <RadListView ref="listView" for="item in productList" height="30%">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*" padding="10"
              @tap="onMoveItemTap(item)" @longPress="onDeleteItemTap(item)">
              <Image :src="item.image"  col="0" height="30"/>
              <label :text="item.name" class="h2" col="1"/>
              <label :text="item.price" class="h2" col="2"/>
            </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addProduct')" @tap="addProduct" 
                width="50%"/>
    </StackLayout>
  </Page>
</template>

<script>
  import sideDrawer from '~/mixins/sideDrawer'
  import imageSelector from '~/mixins/imageSelector'
  import ProdCategoryMove from './modalPages/ProdCategoryMove'
  import ProductAdd from './modalPages/ProductAdd'
  import Confirm from './modalPages/Confirm'
  import general from '~/mixins/general'
  export default {
    name: 'CategoryDetail',
    mixins: [ imageSelector,general, sideDrawer ],
    props: {
      item: Object,
    },
    data() {
      return {
        productList: this.$store.getters.productsByCatg(this.item.productCategoryId),
        editedItem: {},
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
        if (this.editedItem.productCategoryId) {
          if (!this.editedItem.categoryName) this.note(this.$t('nameIsRequired'))
          else {
            const platformModule = require("tns-core-modules/platform")
            if (platformModule.isIOS) { // returns an index instead of value so change
              let values = this.$store.getters.prepAreas
              this.editedItem.categoryName = values[parseInt(this.editedItem.categoryName,10)]}
            delete this.editedItem.nbrOfProducts
            if (this.editedItem.description != this.item.description) { //preparation area changed
              this.editedItem.preparationId = this.$store.prepAreasByDesc(
                  this.editedItem.description).preparationAreaId }
            this.$backendService.updateCategory(this.editedItem)
            this.$store.commit('productCategory',this.editedItem)
            this.hideKeyboard()
        }}
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
          this.productList = this.$store.getters.productsByCatg(this.item.productCategoryId)
      }
    }
  }
</script>
