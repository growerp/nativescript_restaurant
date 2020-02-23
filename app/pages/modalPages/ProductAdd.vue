<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="10">
      <label :text="$t('addProduct')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="$t('addProduct')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  import general from '~/mixins/general'
  const platformModule = require("tns-core-modules/platform")
  export default {
    name: 'ProductAdd',
    mixins: [general],
    props: { 
      categoryName: String // filled when adding product in category detail
    },
    data() {
      return {
        item: { 
          name: '',
          price: '',
          categoryName: '',
        },
        itemMeta: {
          propertyAnnotations: [
            { name: 'productId', ignore: true},
            { name: 'name', index: 0},
            { name: 'price', index: 1, editor: 'Decimal'},
            { name: 'categoryName', index: 3,
              ignore: this.categoryName? true : false, editor: 'Picker',
              valuesProvider: this.$store.getters.productCategoriesDesc()
            },
          ]
        },
        editedItem: null,
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
          else if (!this.editedItem.categoryName && !this.categoryName)
               this.note(this.$t('selectCategory')) 
          else {
            if(!this.categoryName) {
              if (platformModule.isIOS) { // returns an index instead of value so change
                let values = this.$store.getters.productCategoriesDesc()
                this.editedItem.categoryName = values[parseInt(
                  this.editedItem.categoryName,10)]}}
            else this.editedItem.categoryName = this.categoryName
            this.editedItem.productCategoryId =
                this.$store.getters.productCategoryByDesc(
                    this.editedItem.categoryName).productCategoryId
            this.$backendService.createProduct(this.editedItem)
            .then( (result) => {
              this.$store.commit('product', {
                verb: 'add',
                productId: result.data.productId,
                name: this.editedItem.name,
                price: this.editedItem.price,
                image: global.noImage,
                productCategoryId: this.editedItem.productCategoryId,
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
