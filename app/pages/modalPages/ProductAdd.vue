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
      categoryName: String // filled when adding product in category detail
    },
    data() {
      return {
        item: { 
          name: '',
          price: '',
          categoryName: '',
          categoryName1: this.categoryName,
        },
        itemMeta: {
          propertyAnnotations: [
            { name: 'productId', ignore: true},
            { name: 'name', index: 0},
            { name: 'price', index: 1, editor: 'Decimal'},
            { name: 'categoryName', index: 3,
              ignore: this.categoryName? true : false,
              editor: 'Picker',
              valuesProvider: this.$store.getters.productCategoriesDesc()
            },
            { name: 'categoryName1', index: 2,
              ignore: this.categoryName? false : true,
              readOnly: this.categoryName? true : false,
              displayName: this.$t('name')
            },
          ]
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
          delete this.editedItem.categoryName1
          if (this.categoryName) {
            this.editedItem.categoryName = this.categoryName
          }
          if (!this.editedItem.name) this.note(this.$t('nameIsRequired'))
          else if (!this.editedItem.price) this.note(this.$t('enterPrice'))
          else if (!this.editedItem.categoryName) this.note(this.$t('selectCategory')) 
          else {
            const platformModule = require("tns-core-modules/platform")
            if (platformModule.isIOS) { // returns an index instead of value so change
              let values = this.$store.getters.productCategoriesDesc()
              this.editedItem.categoryName = values[parseInt(
                  this.editedItem.categoryName,10)]
            }
            this.editedItem.productCategoryId =
                this.$store.getters.productCategoryByDesc(
                    this.editedItem.categoryName).productCategoryId
            this.$backendService.createProduct(this.editedItem)
            .then( (result) => {
              this.$store.commit('product', {
                verb: 'add',
                productId: result.data.productId,
                name: this.editedItem.name,
                image: global.noImage,
                price: this.editedItem.price,
                productCategoryId: this.editedItem.productCategoryId,
                categoryName: this.editedItem.categoryName, 
              })
            })
            this.$modal.close()
          }
        }
      }
    }
  }

</script>

<style>
</style>
