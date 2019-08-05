<template>
        <page>
	       <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
               <RadDataForm ref="addPrep" :source="item" :metadata="itemMeta"
                  @propertyCommitted="onCommitted"/>
               <Button class="btn btn-outline" :text="$t('addPreparationArea')" @tap="submit" />
               <Button class="btn btn-outline" :text="$t('cancel')" @tap="$modal.close()" />
           </StackLayout>
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
                  this.editedItem['preparationAreaId'] = result.data.preparationAreaId
                  this.editedItem['image'] = global.noImage
                  this.$modal.close(this.editedItem)
                })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
