<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addTableArea')" class="h2" horizontalAlignment="center"/>
      <RadDataForm :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <Button class="button" :text="$t('addArea')" @tap="submit" />
      <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
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
          { name: 'nbrOfSpots', required: false, index: 1},
        ]
      },
      editedItem: {},
    };
  },
  methods: {
    onCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem != '') {
        this.$backendService.createAccommodationArea(this.editedItem)
        .then((result) => {
          this.$store.commit('accommodationArea', {
              verb: 'add',
              description: this.editedItem.description,
              accommodationAreaId: result.data.accommodationAreaId,
              accommodationSpots: result.data.accommodationSpots,
              image: global.noImage,
              nbrOfSpots: this.editedItem.nbrOfSpots})
        })
      }
      this.$modal.close()
    }
  }
}

</script>

<style>
</style>
