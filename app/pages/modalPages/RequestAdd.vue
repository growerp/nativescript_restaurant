<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
	  <StackLayout class="p-20" backgroundColor="white" paddingTop="40" width="90%">
      <label :text="$t('addRequest')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
        @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button :text="$t('addRequest')" @tap="submit" col="1"/>
      </GridLayout>
	  </StackLayout></ModalStack>
  </page>
</template>

<script>
import general from '~/mixins/general'
export default {
  name: 'RequestAdd',
  mixins: [general],
  data() {
    return {
      item: { requestName: '',
        description: '',
      },
      itemMeta: {
        propertyAnnotations: [
          { name: 'requestName', index: 0},
          { name: 'description', editor: 'MultilineText', index: 1},
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
        if (!this.editedItem.requestName)this.note(this.$t('titleIsRequired'))
        else {
          this.$backendService.createRequest(this.editedItem)
          .then( result => {
            this.editedItem.requestId = result.data.requestId
            this.editedItem.image = global.noImage
            this.editedItem.note = {date: 'now',
                requestId: result.data.requestId,
                text: this.editedItem.description,
                partyId: this.$store.getters.currentEmployeePartyId,
                fullname: this.$store.getters.currentEmployeeFullName}
            this.editedItem.verb = 'add'
            this.$store.commit('request', this.editedItem)
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
