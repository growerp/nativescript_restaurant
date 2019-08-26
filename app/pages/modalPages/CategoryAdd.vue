<template>
    <page>
	<StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <RadDataForm ref="addItem" :source="item"
            @propertyCommitted="onCommitted"/>
        <Button class="button" :text="$t('addCategory')" @tap="submit" />
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
	</StackLayout>
</page>
</template>

<script>
export default {
    name: 'CategoryAdd',
    data() {
        return {
            item: { categoryName: '' },
            itemMeta: {
                propertyAnnotations: [
                    { name: 'categoryName', required: true, index: 0},
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
                this.$backendService.createCategory(this.editedItem)
                .then( result=> {
                  this.editedItem['productCategoryId'] = result.data.productCategoryId
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
