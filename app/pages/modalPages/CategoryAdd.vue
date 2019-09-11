<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addCategory')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <Button class="button" :text="$t('addCategory')" @tap="submit" />
      <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  import general from '~/mixins/general'
  export default {
    name: 'CategoryAdd',
    mixins: [general],
    data() {
      return {
        item: { categoryName: '', description: '' },
        itemMeta: {
          propertyAnnotations: [
              { name: 'categoryName', required: true, index: 0},
              { name: 'description', required: true, index: 1,
                  displayName: this.$t('preparation'),
                  editor: 'Picker', valuesProvider: this.$store.getters.prepAreas()},
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
            this.editedItem.preparationAreaId = 
                this.$store.getters.prepAreasByDesc(this.editedItem.description).preparationAreaId
            this.$backendService.createCategory(this.editedItem)
            .then(() => {
              this.$backendService.getCategoriesAndProducts()
              .then(() => {
                this.$modal.close()
            })})
          }
        }
      }
    }
  }
</script>

<style>
</style>
