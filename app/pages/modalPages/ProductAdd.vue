<template>
    <page>
	<StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
            @propertyCommitted="onCommitted"/>
        <Button class="button" :text="$t('addProduct')" @tap="submit" />
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
	</StackLayout>
</page>
</template>

<script>
export default {
    name: 'ProductAdd',
    data() {
        return {
            item: { name: '',
                    price: '',
                    categoryName: ''},
            itemMeta: {
                  propertyAnnotations: [
                      { name: 'productId', ignore: true},
                      { name: 'name', required: true, index: 0},
                      { name: 'price', required: true, index: 1},
                      { name: 'categoryName', required: true, index: 2,
                        editor: 'List',
                        valuesProvider: this.$store.getters.categories
                      }]
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
                let catId = this.$store.getters.categoryByDesc(
                    this.editedItem.categoryName).productCategoryId
                this.$backendService.createProduct(
                      this.editedItem.name,
                      this.editedItem.price,
                      catId )
                .then( result => {
                    this.editedItem['productId'] = result.data.productId
                    this.editedItem['image'] = global.noImage
                    this.editedItem['productCategoryId'] = catId
                    this.$modal.close(this.editedItem)
                  })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
