<template>
  <page backgroundColor="#A0000000"><ModalStack dismissEnabled="true" class="modal-container">
	  <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addNote')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
        @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="$t('addNote')" @tap="submit" col="1"/>
      </GridLayout>
  	</StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  name: 'RequestNoteAdd',
  props: {
    requestId: String
  },
  data() {
    return {
      item: { text: '',
      },
      itemMeta: {
        propertyAnnotations: [
          { name: 'requestId', ignore: true},
          { name: 'text', displayName: 'Note',
            editor: 'MultilineText', required: true},
          { name: 'date', ignore: true}
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
      if (this.editedItem != '') {
        this.editedItem.requestId = this.requestId
        this.$backendService.createRequestNote(this.editedItem)
        .then( result => {
          this.editedItem.date = 'Now'
          this.editedItem.requestId = this.requestId
          this.editedItem.verb = 'add'
          this.$store.commit('note', this.editedItem)
          this.$modal.close()
        })}
    }
  }
}

</script>

<style>
</style>
