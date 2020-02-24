<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :save="true" :back="true"
          :onActionTap="onSaveTap" header="preparationAreaDetail"/>
    </ActionBar>
    <GridLayout rows="auto, auto, auto,*, auto,10">
      <GridLayout width="100%" columns="100,30,*" rows="50,50,"
              padding="20" row="0">
        <Image ref="prepForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('prep', item.preparationAreaId)"/>
        <Button :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('prep', item.preparationAreaId)"/>
      </GridLayout>
      <RadDataForm ref="itemForm" :source="item" row="1"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label :text="$t('categoriesPrepared')" class="h3" row="2"
          paddingLeft="15"/>
      <RadListView for="item in categoryList"  row="3">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*"  padding="10"
              @tap="onMoveItemTap(item)" @longPress="onDeleteItemTap(item)">
            <Image :src="item.image" col="0" height="40"/>
            <label :text="item.categoryName" class="h2" col="1"/>
            <label :text="item.nbrOfProducts" class="h2" col="2"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button :text="$t('addCategory')" 
          @tap="onAddCategoryTap" width="50%"  row="4"
          :visibility="!editedItem ? 'visible':'hidden'"/>
    </GridLayout>
  </Page>
</template>

<script>

import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import PrepCategoryMove from './modalPages/PrepCategoryMove'
import CategoryAdd from './modalPages/CategoryAdd'
import Confirm from './modalPages/Confirm'
  
export default {
  name: 'PrepDetail',
  mixins: [ imageSelector, general, ],
  props: {
      item: Object
  },
  data() {
    return {
      categoryList: this.$store.getters.productCategoriesByPrepId(
          this.item.preparationAreaId),
      editedItem: null,
      itemMeta: {
        propertyAnnotations: [
          { name: 'preparationAreaId', ignore: true},
          { name: 'image', ignore: true},
          { name: 'nbrOfCatg', ignore: true},
          { name: 'description', index: 0},
          { name: 'printerIp', index: 1 },
        ]},
    }
  },
  created() {
      if (!this.item.printerIp) this.item.printerIp = '' 
      if (!this.itemImage.length) {
        this.$backendService.downloadImage('medium', 'prep',
          this.item.preparationAreaId)
          .then(result => { this.itemImage = result.data.imageFile })}
  },
  methods: {
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    onSaveTap() {
      if (this.editedItem) {
        if (!this.editedItem.description) this.note(this.$t('nameIsRequired'))
        else {
          this.$store.dispatch('updatePreparationArea', this.editedItem)
        }
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    onMoveItemTap(item) {
      this.$showModal(PrepCategoryMove, { props: { productCategory: item }})
      .then(() => {
        this.refresh()
      })
    },
    onDeleteItemTap(item) {
      if (item.nbrOfProducts != "0") {
        this.note(this.$t('cannotDelCatProd'))
      } else {
        this.$showModal(Confirm,{ props: {
          message: this.$t('deleteCategory') + item.categoryName + "?"}
        })
        .then (data => {
          if (data) {
            this.$store.dispatch('deleteProductCategory', item.productCategoryId)
            this.refresh()
          }
        })
      }
    },
    onAddCategoryTap() {
      this.$showModal(CategoryAdd,
             { props: {prepAreaDescription: this.item.description}})
      .then(() => { 
        this.refresh()
      })
    },
    refresh() {
        this.categoryList = this.$store.getters.productCategoriesByPrepId(
          this.item.preparationAreaId)
    }
  }
}
</script>
