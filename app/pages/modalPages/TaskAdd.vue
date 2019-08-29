<template>
    <page>
	     <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
            @propertyCommitted="onCommitted"/>
        <Button class="button" :text="$t('addTask')" @tap="submit" />
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
	</StackLayout>
</page>
</template>

<script>
export default {
    name: 'TaskAdd',
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
                        editor: 'List', valuesProvider: this.$store.getters.userNames},
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
                this.editedItem.partyId = this.$store.getters.
                    userByFirstLastName(this.editedItem.partyId)
                this.$backendService.createTask(this.editedItem).then( result => {
                    this.editedItem.workEffortId = result.data.workEffortId
                    this.editedItem.image = global.noImage
                    this.editedItem.fullName = this.$store.getters.user.firstName + ' ' + this.$store.getters.user.lastName
                    this.editedItem.statusId = this.$t('WeApproved')
                    this.$modal.close(this.editedItem)
                  })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
