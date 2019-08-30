<template>
    <page><ModalStack dismissEnabled="true" class="modal-container">
	    <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
            <label :text="$t('addRequest')" class="h2" horizontalAlignment="center"/>
            <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
                @propertyCommitted="onCommitted"/>
            <Button class="button" :text="$t('addRequest')" @tap="submit" />
            <Button class="button" :text="$t('cancel')" @tap="$modal.close()"/>
	    </StackLayout></ModalStack>
    </page>
</template>

<script>
export default {
    name: 'RequestAdd',
    data() {
        return {
            item: { requestName: '',
                    description: '',
            },
            itemMeta: {
                  propertyAnnotations: [
                      { name: 'requestName', required: true, index: 0},
                      { name: 'description', editor: 'MultilineText', index: 1},
                  ]
            },
            editedItem: {},
        }
    },
    methods: {
        onCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        submit() {
            if (this.editedItem) {
                this.$backendService.createRequest(this.editedItem)
                .then( result => {
                  this.editedItem.requestId = result.data.requestId
                  this.editedItem['image'] = global.noImage
                  this.editedItem.notes = [{date: 'now',
                          requestId: result.data.requestId,
                                text: this.editedItem.description,
                                partyId:'0', fullname:'me!'}]
                  this.$modal.close(this.editedItem)
                })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
