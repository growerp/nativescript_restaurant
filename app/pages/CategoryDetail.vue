<template>
<Page>
    <ActionBar>
        <GridLayout width="100%" columns="auto, *, auto" paddingRight="10">
          <Label class="title" :text="$t('back')" col="0" @tap="$navigateBack"/>
            <StackLayout orientation="horizontal" @tap="$navigateTo($routes.SetUp)" col="1"
                horizontalAlignment="center">
              <Label class="title" :text="$t('categoryDetail')"/>
              <Image src="~/assets/images/go-back-arrow.png" height="15"/>
            </StackLayout>
          <Image src="~/assets/images/save.png" height="20" @tap="onSaveTap" col="2"/>
        </GridLayout>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
        <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image ref="areaForm" :src="itemImage" width="100"
                height="100" col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
                @tap="selectPicture('category', item.productCategoryId)"/>
            <Button class="button" :text="$t('useCamera')"  col="2" row="1"
                @tap="takePicture('category', item.productCategoryId)"/>
        </GridLayout>
        <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
        <RadDataForm ref="itemForm" :source="item"
            :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
        <Label class="title" text="Products"/>
        <RadListView ref="listView" for="item in productList">
            <v-template>
              <GridLayout columns="50, *, auto" rows="*" class="item"
                 paddingRight="5" paddingLeft="5" @tap="onMoveProduct(item.productId)">
                  <Image :src="item.image"  col="0" class="thumbnail"/>
                  <label :text="item.name" class="h2" col="1"/>
                  <label :text="item.price" class="p" col="2"/>
               </GridLayout>
            </v-template>
        </RadListView>
    </StackLayout>
</Page>
</template>

<script>
import imageSelector from '~/mixins/imageSelector'
import ProdCategoryMove from './modalPages/ProdCategoryMove'
import general from '~/mixins/general'
export default {
    name: 'CategoryDetail',
    mixins: [ imageSelector,general ],
    props: {
        list: Array,
        index: Number,
    },
    data() {
        return {
            item: this.list[this.index],
            productList: [],
            editedItem: {},
            itemMeta: {
                propertyAnnotations: [
                    { name: 'productCategoryId', hidden: true, ignore: true},
                    { name: 'image', hidden: true, ignore: true},
                    { name: 'description', required: true, index: 0},
                    { name: 'nbrOfProducts', hidden: true , ignore: true}]},
          }
    },
    created() {
        this.$backendService.downloadImage('medium', 'category',
            this.item.productCategoryId)
        .then(result => { this.itemImage = result.data.imageFile})
        this.$backendService.getProductList(this.item.productCategoryId)
        .then(result => { this.productList = result.data.products })
    },
    methods: {
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onMoveProduct(prodId) {
          this.$showModal(ProdCategoryMove,
            { props: {prodId: prodId, catId: this.item.productCategoryId}})
          .then( result => {
            for (let i=0; i < this.productList.length; i++) {
              if (this.productList[i].productId == result) {
                this.productList.splice(i,1); break}}
          })
        },
        onSaveTap() {
          if (this.editedItem && this.editedItem.productCategoryId) {
            this.$backendService.updateCategory(this.editedItem)
            this.list.splice(this.index,1,this.editedItem)
            this.hideKeyboard()
          }
          this.$navigateBack()
        },
        onDeleteTap() { //delete Item
          if (this.productList.length !== 0) {
            this.note(this.$t('cannotDelCatProd'))
          } else {
            prompt({
              title: this.$t('deleteCategory') + this.item.categoryName + "?",
              okButtonText: "Ok",
              cancelButtonText: this.$t('cancel')
            }).then (data => {
              if (data.result == true) {
                this.$backendService.deleteCategory(this.item.productCategoryId)
                this.list.splice(this.index,1)}
              this.$navigateBack()
            })}
        },
    }
}
</script>
