<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="item.name" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('movePrepCat')" textWrap="true" class="h3"
          horizontalAlignment="center" padding="10"/>
      <RadDataForm :source="prep" :metadata="prepMeta" height="150"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('selectArea')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
    name: 'PrepCategoryMove',
    props: {
      item: {}
    },
    data() {
      return {
        prep: { name: ''},
        prepMeta: {
          propertyAnnotations: [
            { name: 'name', displayName: '', editor: 'Picker', 
              valuesProvider: 
                this.$store.getters.preparationAreasDescMinusOne(
                    this.item.preparationAreaId)
            },
        ]},
      }
    },
    methods: {
      onCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)},
      submit() {
        if (this.editedItem) {
          const platformModule = require("tns-core-modules/platform")
          if (platformModule.isIOS) { // returns an index instead of value so change
            let values = this.$store.getters.preparationAreasDescMinusOne(
                  this.item.preparationAreaId)
            this.editedItem.name = values[parseInt(this.editedItem.name,10)]
          }
          console.log("====prep selected:" + this.editedItem.name)
          let preparationAreaId = this.$store.getters.preparationAreaByDesc(
              this.editedItem.name).preparationAreaId
          this.$backendService.updateCategory({
            productCategoryId: this.item.productCategoryId,
            preparationAreaId: preparationAreaId})
          let productCategory = Object.assign({},
            this.$store.getters.productCategoryById(this.item.productCategoryId))
  console.log(" in prepctmove prodcat: " + JSON.stringify(productCategory))
          productCategory.preparationAreaId = preparationAreaId
          productCategory.description = this.editedItem.name
          productCategory.verb = "update"
          this.$store.commit('productCategory', productCategory)
          this.$modal.close()
        }
      },
   },
}

</script>

<style>
</style>
