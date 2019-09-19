<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="10">
      <label :text="$t('addProduct')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('addProduct')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  import general from '~/mixins/general'
  export default {
    name: 'ProductAdd',
    mixins: [general],
    props: { 
      categoryName: String },
    data() {
      return {
        item: { 
            name: '',
            price: '',
            categoryName: this.categoryName? this.categoryName: '' },
        itemMeta: {
          propertyAnnotations: [
              { name: 'productId', ignore: true},
              { name: 'name', required: true, index: 0},
              { name: 'price', required: true, index: 1},
              { name: 'categoryName', required: true, index: 2,
                readOnly: this.categoryName? true : false,
                editor: 'Picker',
                valuesProvider: this.$store.getters.productCategoriesDesc()
              }]
        },
        editedItem: {},
      }
    },
    methods: {
      onCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
      },
      submit() {
        if (this.editedItem) {
          if (!this.editedItem.name) this.note(this.$t('nameIsRequired'))
          else if (!this.editedItem.price) this.note(this.$t('enterPrice'))
          else if (!this.editedItem.categoryName) this.note(this.$t('selectCategory'))
          else {
            const platformModule = require("tns-core-modules/platform")
            if (platformModule.isIOS) { // returns an index instead of value so change
              let values = this.$store.getters.productCategoriesDesc()
              this.editedItem.categoryName = values[parseInt(this.editedItem.categoryName,10)]}
            let productCategoryId = this.$store.getters.productCategoryByDesc(
                this.editedItem.categoryName).productCategoryId
            this.$backendService.createProduct(
                this.editedItem.name,
                this.editedItem.price,
                productCategoryId )
            .then( (result) => {
              this.$store.commit('product', {
                  productId: result.data.productId,
                  name: this.editedItem.name,
                  image: global.noImage,
                  price: this.editedItem.price,
                  productCategoryId: productCategoryId,
                  categoryName: this.editedItem.categoryName, 
              })
              this.$modal.close()
            })
          }
        }
      }
    }
  }

</script>

<style>
</style>
