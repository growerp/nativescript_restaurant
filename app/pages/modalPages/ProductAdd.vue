<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="10">
      <label :text="$t('addProduct')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <Button class="button" :text="$t('addProduct')" @tap="submit()" />
      <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
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
                editor: 'Picker',
                valuesProvider: this.$store.getters.categories()
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
            let productCategoryId = this.$store.getters.categoryAndProductsByDesc(
                this.editedItem.categoryName).productCategoryId
            this.$backendService.createProduct(
                this.editedItem.name,
                this.editedItem.price,
                productCategoryId )
            .then( (result) => {
              this.$store.commit('categoryAndProduct', {
                  productCategoryId: productCategoryId, 
                  products: [{
                    productId: result.data.productId,
                    name: this.editedItem.name,
                    image: global.noImage,
                    price: this.editedItem.price }]
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
