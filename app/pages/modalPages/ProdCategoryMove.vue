<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="name" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('moveProdCat')" textWrap="true" class="h3"
          horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta" height="150"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('selectCategory')" @tap="submit" col="1"/>
        <Button :text="$t('cancel')" @tap="$modal.close()" class="button" col="0"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  export default {
    name: 'ProdCategoryMove',
    props: {
      prodId: String,
      catId: String,
      name: String,
    },
    data() {
      return {
        item: { name: ''},
        itemMeta: {
          propertyAnnotations: [
              { name: 'name', displayName: '', editor: 'Picker', 
                valuesProvider: this.$store.getters.categoriesMinusOne(this.catId)},
        ]},
      }
    },
    methods: {
      onCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)},
      submit() {
        if (this.editedItem) {
          let param = {}
          param.productId = this.prodId
          const platformModule = require("tns-core-modules/platform")
          if (platformModule.isIOS) { // returns an index instead of value so change
            let values = this.$store.getters.categoriesMinusOne(this.catId)
            this.editedItem.name = values[parseInt(this.editedItem.name,10)]}
          param.productCategoryId = this.$store.getters.categoryAndProductsByDesc(
              this.editedItem.name).productCategoryId
          this.$backendService.updateProduct(param)
          this.$store.commit('categoryAndProduct',{ 
                oldProductCategoryId: this.catId,
                productCategoryId: param.productCategoryId,
                products: [{productId: this.prodId}],
                })
          this.$modal.close() // to delete from list
        }
      },
    },
  }

</script>

<style>
</style>
