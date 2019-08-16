<template>
<Page>
    <ActionBar>
        <GridLayout width="100%" columns="auto, *, auto">
          <Label class="title" :text="$t('back')" col="0" @tap="$navigateBack"/>
          <StackLayout orientation="horizontal" @tap="$navigateTo($routes.SetUp)" col="1"
              horizontalAlignment="center">
            <Label class="title" :text="$t('productDetail')"/>
            <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          </StackLayout>
          <Label @tap="onSaveTap" :text="$t('save')" col="2"/>
        </GridLayout>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
        <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image  :src="itemImage" width="100"
                height="100" col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
                @tap="selectPicture('product', item.productId)"/>
            <Button class="button" :text="$t('useCamera')"  col="2" row="1"
                @tap="takePicture('product', item.productId)"/>
        </GridLayout>
        <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
        <RadDataForm ref="itemForm" :source="item" height="100%"
            :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
    </StackLayout>
</Page>
</template>

<script>
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
export default {
    name: 'ProductDetail',
    mixins: [ imageSelector, general ],
    props: {
        list: Array,
        index: Number,
    },
    data() {
        return {
            editedItem: {},
            item: this.list[this.index],
            itemMeta: {
                propertyAnnotations: [
                    { name: 'productId', hidden: true, ignore: true},
                    { name: 'image', hidden: true, ignore: true},
                    { name: 'productName', required: true, index: 0},
                    { name: 'price', required: true, index: 1,
                        editor: 'Decimal'},
                    { name: 'productCategoryId', hidden: true, ignore: true},
                    { name: 'categoryName', required: true, index: 2,
                      editor: 'Label'},
                    { name: 'newCategoryName', displayName: 'New Category',
                      index: 3, editor: 'List',
                      valuesProvider: this.$store.getters.categories }
                ],
            },
            itemImage: '',
        }
    },
    created() {
        this.item['newCategoryName'] = ''
        this.$backendService.downloadImage('medium', 'product', this.item.productId)
        .then(result => { this.itemImage = result.data.imageFile})
    },
    methods: {
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onSaveTap() {
          if (this.editedItem) {
            if(this.editedItem.newCategoryName) {
              let newProductCategory = this.$store.getters.categoryByDesc(this.editedItem.newCategoryName)
              if (newProductCategory.productCategoryId !== this.item.productCategoryId) {
                this.editedItem.productCategoryId = newProductCategory.productCategoryId}}
              this.$backendService.updateProduct(this.editedItem)
              this.list.splice(this.index,1,this.editedItem)
          }
          this.hideKeyboard()
          this.$navigateBack()
        },
        onDeleteTap() {
          prompt({
              title: this.$t('delProduct') + this.item.name + "?",
              okButtonText: "Ok",
              cancelButtonText: this.$t('cancel')
          }).then (data => {
            if (data.result == true) {
              this.$backendService.deleteProduct(this.item.productId)
              this.list.splice(this.index,1)
              this.$navigateBack()}
          })
        },
      }
  }
</script>
