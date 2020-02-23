<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="10">
      <label :text="$t('addPreparationArea')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addPrep" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="$t('addArea')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
import general from '~/mixins/general'
export default {
  name: 'PrepAdd',
  mixins: [general],
  data() {
    return {
      item: { description: '' , printerIp: ' '},
      itemMeta: {
        propertyAnnotations: [
            { name: 'description', required: true, index: 0},
            { name: 'printerIp', index: 1},
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
        if (!this.editedItem.description) this.note(this.$t('nameIsRequired'))
        else {
          this.$store.dispatch('createPreparationArea', this.editedItem)
          this.$modal.close()
        }
      }
    }
  }
}

</script>

<style>
</style>
