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
                description: this.prepAreaDescription? this.prepAreaDescription : ''
        },
        itemMeta: {
          propertyAnnotations: [
              { name: 'categoryName', required: true, index: 0},
              { name: 'description', required: true, index: 1,
                  readOnly: this.prepAreaDescription? true : false,
                  displayName: this.$t('preparation'),
                  editor: 'Picker', valuesProvider: this.$store.getters.preparationAreasDesc()},
          ]
        },
        editedItem: {},
      }
    },
    methods: {
      onCommitted(data) {
          this.editedItem = JSON.parse(data.object.editedObject)},
      submit() {
        if (this.editedItem) {
          if (!this.editedItem.categoryName) this.note(this.$t('nameIsRequired'))
          else if (!this.editedItem.description) this.note(this.$t('preparationArea') + this.$t('isRequired'))
          else {
            let description = ''
            const platformModule = require("tns-core-modules/platform")
            if (platformModule.isIOS) { // returns an index instead of value so change
              let values = this.$store.getters.prepAreas()
              description = values[parseInt(this.editedItem.description,10)]
            } else {
              description = this.editedItem.description
            }
            this.editedItem.preparationAreaId = 
                this.$store.getters.preparationAreaByDesc(description).preparationAreaId
            console.log("===== add category edited item:" + JSON.stringify(this.editedItem))
            this.$backendService.createCategory(this.editedItem)
            .then((result) => {
              this.editedItem.verb = 'add'
              this.editedItem.productCategoryId = result.data.productCategoryId
              this.$store.commit('productCategory', this.editedItem)
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
