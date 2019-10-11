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
  const platformModule = require("tns-core-modules/platform")
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
        },
        itemMeta: {
          propertyAnnotations: [
            { name: 'categoryName', required: true, index: 0},
            { name: 'description', index: 2,
              ignore: this.prepAreaDescription? true : false,
              displayName: this.$t('preparation'), index: 2, editor: 'Picker',
              valuesProvider: this.$store.getters.preparationAreasDesc()
            },
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
          if (!this.editedItem.categoryName)
              this.note(this.$t('nameIsRequired'))
          else if (!this.editedItem.description && !this.prepAreaDescription)
              this.note(this.$t('preparationArea') + this.$t('isRequired'))
          else {
            if (!this.prepAreaDescription) {
              if (platformModule.isIOS) { // returns an index instead of value so change
                let values = this.$store.getters.preparationAreasDesc()
                this.editedItem.description =
                    values[parseInt(this.editedItem.description,10)]}}
            else this.editedItem.description = this.prepAreaDescription
              this.editedItem.preparationAreaId = 
                this.$store.getters.preparationAreaByDesc(
                  this.editedItem.description).preparationAreaId
            this.$store.dispatch('createProductCategory', this.editedItem)
            .then(() => {
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
