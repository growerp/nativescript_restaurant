<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="preparationAreaDetail"/>
    </ActionBar>
    <StackLayout padding="10" height="100%">
      <GridLayout width="100%" columns="100,30,*" rows="50,50"
          @longPress="onDeleteTap" >
        <Image ref="prepForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('prep', item.preparationAreaId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('prep', item.preparationAreaId)"/>
      </GridLayout>
      <Label :text="$t('longToDelete')" horizontalAlignment="center" 
        @longPress="onDeleteTap" class="p"/>
      <RadDataForm ref="itemForm" :source="Object.assign({},item)"
          @longPress="onDeleteTap" 
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label :text="$t('categoriesPrepared')" class="h3" horizontalAlignment="center"/>
      <RadListView for="cat in categoryList" @itemTap="onMoveTap"  height="50%">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*"  padding="10">
            <Image :src="cat.image" col="0" height="40"/>
            <label :text="cat.categoryName" class="h2" col="1"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addCategory')"
          @tap="addCategory"/>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import PrepCategoryMove from './modalPages/PrepCategoryMove'
import CategoryAdd from './modalPages/CategoryAdd'
  
export default {
  name: 'PrepDetail',
  mixins: [ imageSelector, general, sideDrawer],
  props: {
      item: Object,
  },
  data() {
      return {
          categoryList: this.$store.getters.productCategoriesByPrepId(
              this.item.preparationAreaId),
          editedItem: {},
          itemMeta: {
              propertyAnnotations: [
                  { name: 'preparationAreaId', ignore: true},
                  { name: 'image', ignore: true},
                  { name: 'nbrOfCatg', ignore: true},
                  { name: 'description', required: true, index: 0}]},
      }
  },
  created() {
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
          this.$backendService.updatePreparationArea(this.editedItem)
          this.editedItem.verb = 'update'
          this.$store.commit('preparationArea', this.editedItem)
        }
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    onDeleteTap() {
      if (this.categoryList.length) {
        this.note(this.$t('cannotDelPrep'))
      } else {
        confirm({
            title: this.$t('delPrepArea') + this.item.description + "'?",
            okButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel')
        }).then (data => {
          if (data) {
            this.$backendService.deletePreparationArea(
                this.item.preparationAreaId)
            this.$store.commit('preparationArea', {
                  verb: 'delete',
                  preparationAreaId: this.item.preparationAreaId})
          }
          this.$navigateBack()
        })
      }
    },
    onMoveTap(args) {
      this.$showModal(PrepCategoryMove, { props: {  item: args.item}})
      .then(() =>{
        this.categoryList = this.$store.getters.productCategoriesByPrepId(
              this.item.preparationAreaId)})
    },
    addCategory() {
      this.$showModal(CategoryAdd, { props: {prepAreaDescription: this.item.description}})
    }
  }
}
</script>
