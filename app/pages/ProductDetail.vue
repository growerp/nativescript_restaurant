<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="productDetail"/>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image  :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('product', item.productId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('product', item.productId)"/>
      </GridLayout>
      <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
      <RadDataForm :source="item"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
export default {
  name: 'ProductDetail',
  mixins: [ imageSelector, general, sideDrawer],
  props: {
    item: Object,
  },
  data() {
    return {
      editedItem: {},
      itemMeta: {
        propertyAnnotations: [
            { name: 'productId', ignore: true},
            { name: 'image', ignore: true},
            { name: 'name', required: true, index: 0},
            { name: 'price', required: true, index: 1,
                editor: 'Decimal'},
            { name: 'productCategoryId', ignore: true},
            { name: 'categoryName', required: true, index: 2,
              editor: 'Picker',
              valuesProvider: this.$store.getters.productCategoriesDesc(false) }
        ],
      },
    }
  },
  created() {
    this.$backendService.downloadImage('medium', 'product', this.item.productId)
    .then(result => { this.itemImage = result.data.imageFile })
  },
  methods: {
    onItemCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
    },
    onSaveTap() {
      if (this.editedItem) {
        if (!this.editedItem.name) 
          this.note(this.$t('nameIsRequired'))
        else if (!this.editedItem.price)
          this.note(this.$t('enterPrice'))
        else {
          const platformModule = require("tns-core-modules/platform")
          if (platformModule.isIOS) { // returns an index instead of value so change
            let values = this.$store.getters.productCategoriesDesc(false)
            this.editedItem.categoryName = values[parseInt(this.editedItem.categoryName,10)]}
          this.editedItem.productCategoryId = this.$store.getters.productCategoryByDesc(
              this.editedItem.categoryName).productCategoryId
          this.$backendService.updateProduct(this.editedItem)
          this.editedItem.verb = 'update'
          this.$store.commit('product', this.editedItem)
          }
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    onDeleteTap() {
      confirm({
          title: this.$t('delProduct') + this.item.name + "?",
          okButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel')
      }).then (data => {
        if (data) {
          this.$backendService.deleteProduct(this.item.productId)
          this.$store.commit('product', {
                verb: 'delete',
                productId: this.item.productId})
        }
        this.$navigateBack()
      })
    },
  }
}
</script>
