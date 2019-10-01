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
              userPartyId: '',
              priority: 5},
      itemMeta: {
        propertyAnnotations: [
          { name: 'workEffortName', displayName: this.$t('title'),
            required: true, index: 0},
          { name: 'description', editor: 'MultilineText', index: 1},
          { name: 'priority', editor: 'Picker', index: 2,
              valuesProvider: [1,2,3,4,5]},
          { name: 'userPartyId', displayName: this.$t('assignedTo'),
            editor: 'Picker',  index: 3,
              valuesProvider: this.$store.getters.employeeDesc(true)},
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
      if (this.editedItem) {
        if (!this.editedItem.workEffortName)this.note(this.$t('titleIsRequired'))
        else {
          const platformModule = require("tns-core-modules/platform")
          if (platformModule.isIOS) { // returns an index instead of value so change
            let prioValues = [1,2,3,4,5]
            this.editedItem.priority = 
                prioValues[parseInt(this.editedItem.priority,10)]
            let values = this.$store.getters.employeeDesc(true)
            this.editedItem.userPartyId = 
                values[parseInt(this.editedItem.partyId,10)]
          }
          if (!this.editedItem.userPartyId) // default to self
            this.editedItem.userPartyId = this.$store.getters.currentEmployeeFullName
          this.editedItem.userFullName = this.editedItem.userPartyId
          this.editedItem.userPartyId = this.$store.getters.employeeByDesc(
              this.editedItem.userPartyId).partyId
          console.log("==1==taskadd editedItem: " + JSON.stringify(this.editedItem))
          this.$backendService.createTask(this.editedItem).then( result => {
            this.editedItem.workEffortId = result.data.workEffortId
            this.editedItem.image = global.noImage
            this.editedItem.verb = 'add'
          console.log("==2==taskadd editedItem: " + JSON.stringify(this.editedItem))
            this.$store.commit('task', this.editedItem)
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
