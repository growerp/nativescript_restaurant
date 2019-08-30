<template>
    <page>
        <StackLayout class="p-20" backgroundColor="white" paddingTop="40"  width="80%" height="80%">
            <label :text="$t('addProduct')" class="h2" horizontalAlignment="center"/>
            <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
                @propertyCommitted="onCommitted"/>
            <Button class="button" :text="$t('addProduct')" @tap="submit" />
            <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
        </StackLayout>
    </page>
</template>

<script>
import general from '~/mixins/general'
export default {
    name: 'ProductAdd',
    mixins: [general],
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
                        editor: 'Picker',
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
            if (this.editedItem) {
                if (!this.editedItem.name) this.note(this.$t('nameIsRequired'))
                else if (!this.editedItem.price) this.note(this.$t('enterPrice'))
                else if (!this.editedItem.categoryName) this.note(this.$t('selectCategory'))
                else {
                    let catId = this.$store.getters.categoryByDesc(
                        this.editedItem.categoryName).productCategoryId
                    this.$backendService.createProduct(
                        this.editedItem.name,
                        this.editedItem.price,
                        catId )
                    .then( result => {
                        this.editedItem.productId = result.data.productId
                        this.editedItem.image = global.noImage
                        this.editedItem.categoryName = this.editedItem.categoryName.substring(2)
                        this.editedItem.productCategoryId = catId
                        this.$modal.close(this.editedItem)
                  })}}
        }
    }
}

</script>

<style>
</style>
