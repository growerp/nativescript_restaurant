<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addTableArea')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="$t('addArea')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  name: 'AreaAdd',
  data() {
    return {
      item: {
        description: '',
        nbrOfSpots: '',
//      nbrOfSeats: ''
      },
      itemMeta: {
        propertyAnnotations: [
          { name: 'description', required: true, index: 0},
          { name: 'nbrOfSpots', required: false, index: 1,
              editor: 'Number' },
        ]
      },
      editedItem: null,
    };
  },
  methods: {
    onCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem != '') {
        this.$store.dispatch('createAccommodationArea', this.editedItem)
        this.$modal.close()
      }
    }
  }
}

</script>

<style>
</style>
