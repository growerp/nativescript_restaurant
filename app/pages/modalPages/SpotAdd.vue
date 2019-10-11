<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" width="90%" padding="20">
      <label :text="$t('addTable')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('addTable')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  props: {
    accommodationArea: Object
  },
  data() {
    return {
      item: {
        spotNumber: '',
      },
      editedItem: null,
      itemMeta: {
        propertyAnnotations: [
            { name: 'spotNumber', editor: 'Decimal'},
        ]
      }
    };
  },
  methods: {
    onCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem != '') {
        this.$store.dispatch('createAccommodationSpot', {
            accommodationAreaId: this.accommodationArea.accommodationAreaId,
            spotNumber: this.editedItem.spotNumber})
        .then(() => {
          this.$modal.close("test")
        })
      }        
    }
  }
}

</script>

<style>
</style>
