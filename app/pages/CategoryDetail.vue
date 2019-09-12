<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="categoryDetail"/>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('category', item.productCategoryId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('category', item.productCategoryId)"/>
      </GridLayout>
      <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
      <RadDataForm ref="itemForm" :source="item"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="title" :text="$t('products') + $t('tapToMove')"/>
      <RadListView ref="listView" for="item in productList" height="30%" 
          @itemTap="onMoveProduct">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*" paddingRight="10">
              <Image :src="item.image"  col="0" height="50"/>
              <label :text="item.name" class="h2" col="1"/>
              <label :text="item.price" class="h2" col="2"/>
            </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addProduct')" @tap="addProduct"/>
    </StackLayout>
  </Page>
</template>

<script>
  import sideDrawer from '~/mixins/sideDrawer'
  import imageSelector from '~/mixins/imageSelector'
  import ProdCategoryMove from './modalPages/ProdCategoryMove'
  import ProductAdd from './modalPages/ProductAdd'
  import general from '~/mixins/general'
  export default {
    name: 'CategoryDetail',
    mixins: [ imageSelector,general, sideDrawer ],
    props: {
      index: Number,
    },
    data() {
      return {
        item: this.$store.getters.categoriesAndProductsCount[this.index],
        list: this.$store.getters.categoriesAndProductsCount,
        productList: this.$store.getters.categoriesAndProducts[this.index].products,
        editedItem: {},
        itemMeta: {
          propertyAnnotations: [
              { name: 'productCategoryId', ignore: true},
              { name: 'image', ignore: true},
              { name: 'name', required: true, index: 0},
              { name: 'preparationAreaId', ignore: true},
              { name: 'description', required: true, index: 1, displayName: this.$t('preparation'),
                editor: 'Picker', valuesProvider: this.$store.getters.prepAreas(false)},
              { name: 'nbrOfProducts', ignore: true}]},
      }
    },
    created() {
      console.log("====category: " + JSON.stringify(this.item))
      this.$backendService.downloadImage('medium', 'category',
          this.item.productCategoryId)
      .then(result => { this.itemImage = result.data.imageFile})
    },
    methods: {
      onItemCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
      },
      onMoveProduct(args) {
        this.$showModal(ProdCategoryMove,
          { props: {prodId: args.item.productId, catId: this.item.productCategoryId,
                    name: args.item.name}})
        .then(() => {
 //         setTimeout(() => {
            this.productList = this.$store.getters.categoryAndProductsById(
                this.list[this.index].productCategoryId).products
 //          }, 100)
      })
      },
      onSaveTap() {
        if (this.editedItem.productCategoryId) {
          console.log('====this edited Item:' + JSON.stringify(this.editedItem))
          delete this.editedItem.nbrOfProducts
          if (this.editedItem.description != this.item.description) { //preparation area changed
            this.editedItem.preparationId = this.$store.prepAreasByDesc(
                this.editedItem.description).preparationAreaId }
          this.$backendService.updateCategory(this.editedItem)
          this.$store.commit('categoryAndProduct',this.editedItem)
          this.hideKeyboard()
        }
        this.$navigateBack()
      },
      onDeleteTap() { //delete Item
        if (this.productList.length !== 0) {
          this.note(this.$t('cannotDelCatProd'))
        } else {
          confirm({
            title: this.$t('deleteCategory') + this.item.categoryName + "?",
            okButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel')
          })
          .then (data => {
            if (data) {
              this.$backendService.deleteCategory(
                this.item.productCategoryId)
              this.$store.commit('categoryAndProduct', { 
                oldProductCategoryId: this.item.productCategoryId })
            }
            this.$navigateBack()
          })
        }
      },
      addProduct() {
        this.$showModal(ProductAdd, {   props: {categoryName: this.item.name}})
        .then(() => {
          this.productList = this.$store.getters.categoryAndProductsById(
            this.list[this.index].productCategoryId).products
        })
      }
    }
  }
</script>
