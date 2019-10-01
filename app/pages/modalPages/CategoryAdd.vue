<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" padding="10" width="90%">
      <label :text="$t('addCategory')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta" height="30%"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('addCategory')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  import general from '~/mixins/general'
  export default {
    name: 'CategoryAdd',
    props: {
      prepAreaDescription: String
    },
    mixins: [general],
    data() {
      return {
        item: { categoryName: '',
                description:  '',
                description1: this.prepAreaDescription
        },
        itemMeta: {
          propertyAnnotations: [
              { name: 'categoryName', required: true, index: 0},
              { name: 'description', index: 2, 
                ignore: this.prepAreaDescription? true : false,
                displayName: this.$t('preparation'), index: 2, 
                editor: 'Picker', 
                valuesProvider: this.$store.getters.preparationAreasDesc() 
              },
              { name: 'description1', index: 1, 
                ignore: this.prepAreaDescription? false : true,
                readOnly: true,  
                displayName: this.$t('preparation'), index: 1 },
          ]
        },
        editedItem: null,
      }
    },
    methods: {
      onCommitted(data) {
          this.editedItem = JSON.parse(data.object.editedObject)},
      submit() {
        if (this.editedItem) {
          delete this.editedItem.description1
          if (this.prepAreaDescription) {
            this.editedItem.description = this.prepAreaDescription
          }
          if (!this.editedItem.categoryName) this.note(this.$t('nameIsRequired'))
          else if (!this.editedItem.description)  
              this.note(this.$t('preparationArea') + this.$t('isRequired'))
          else {
            const platformModule = require("tns-core-modules/platform")
            if (platformModule.isIOS) { // returns an index instead of value so change
              let values = this.$store.getters.preparationAreasDesc()
              this.editedItem.description = values[parseInt(this.editedItem.description,10)]
            }
            this.editedItem.preparationAreaId = 
                this.$store.getters.preparationAreaByDesc(this.editedItem.description).preparationAreaId
            this.$backendService.createCategory(this.editedItem)
            .then((result) => {
              this.$store.commit('productCategory', {
                verb: 'add',
                productCategoryId: result.data.productCategoryId,
                image: global.noImage,
                categoryName: this.editedItem.categoryName,
                preparationAreaId: this.editedItem.preparationAreaId,
                description: this.editedItem.description,
                nbrOfProducts: '0'
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
