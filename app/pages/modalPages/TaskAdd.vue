<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout class="p-20" backgroundColor="white" padding="20" width="90%">
      <label :text="$t('addTask')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('addTask')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
import general from '~/mixins/general'
export default {
  name: 'TaskAdd',
  mixins: [general],
  data() {
    return {
      item: { workEffortName: '',
              description: '',
              partyId: '',
              priority: 5},
      itemMeta: {
        propertyAnnotations: [
            { name: 'workEffortName', displayName: this.$t('title'),
              required: true, index: 0},
            { name: 'description', editor: 'MultilineText', index: 1},
            { name: 'priority', editor: 'Number', index: 2},
            { name: 'partyId', displayName: this.$t('assignTo'), index: 3,
              editor: 'Picker', valuesProvider: this.$store.getters.userNames},
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
      if (this.editedItem) {
        if (!this.editedItem.workEffortName) this.note(this.$t('titleIsRequired'))
        else {
          const platformModule = require("tns-core-modules/platform")
          if (platformModule.isIOS) { // returns an index instead of value so change
            let values = this.$store.getters.userNames
            this.editedItem.partyId = values[parseInt(this.editedItem.partyId,10)]}
          this.editedItem.partyId = this.$store.getters.userByFirstLastName(
              this.editedItem.partyId)
          this.$backendService.createTask(this.editedItem).then( result => {
            this.editedItem.workEffortId = result.data.workEffortId
            this.editedItem.image = global.noImage
            this.editedItem.fullName = this.$store.getters.user.firstName + ' ' + this.$store.getters.user.lastName
            this.editedItem.statusId = this.$t('WeApproved')
            this.$modal.close(this.editedItem)})}}
    }
  }
}

</script>

<style>
</style>
