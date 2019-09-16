<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addCategory')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta"
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
                  displayName: this.$t('preparation'),
                  editor: 'Picker', valuesProvider: this.$store.getters.prepAreas()},
          ]
        },
        editedItem: {},
      }
    },
    created() {
      console.log("====descr:" + this.prepAreaDescription)
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
            this.$backendService.createCategory(this.editedItem)
            .then((result) => {
              this.editedItem.verb = 'add'
              this.editedItem.preparationAreaId = result.data.preparationAreaId
              this.$store.commit('productCategory', this.editedIem)
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
