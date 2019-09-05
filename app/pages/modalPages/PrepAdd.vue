<template>
    <page><ModalStack dismissEnabled="true" class="modal-container">
        <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
            <label :text="$t('addPreparationArea')" class="h2" horizontalAlignment="center"/>
            <RadDataForm ref="addPrep" :source="item" :metadata="itemMeta"
                @propertyCommitted="onCommitted"/>
            <Button class="button" :text="$t('addPreparationArea')" @tap="submit" />
            <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
        </StackLayout></ModalStack>
    </page>
</template>

<script>
export default {
    name: 'PrepAdd',
    data() {
        return {
            item: { description: '' },
            itemMeta: {
                propertyAnnotations: [
                    { name: 'description', required: true, index: 0},
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
            if (this.editedItem != '') {
                this.$backendService.createPreparationArea(this.editedItem)
                .then( result => {
                  this.$backendService.getPrepAreasAndCategories()
                  this.editedItem.preparationAreaId = result.data.preparationAreaId
                  this.editedItem.nbrOfCatg = 0
                  this.editedItem.image = global.noImage
                  this.$modal.close(this.editedItem)
                })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
