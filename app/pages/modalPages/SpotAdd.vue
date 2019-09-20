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
    accomodationArea: Object
  },
  data() {
    return {
      item: {
          spotNumber: '',
      },
      editedItem: {},
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
        this.$backendService.createAccommodationSpot(
            this.item.accommodationAreaId,
            this.editedItem.spotNumber)
        .then((result) => {
          this.$store.commit('accommodationSpot',{
            verb: "add",
            accommodationAreaId: this.item.accommodationAreaId,
            descripion: this.item.description,
            accommodationSpotId: result.data.accommodationSpotId,
            spotNumber: this.editedItem.spotNumber,
            image: global.noImage
          })
          this.$modal.close()
        })
      }        
    }
  }
}

</script>

<style>
</style>
