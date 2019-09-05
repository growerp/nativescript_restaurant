<template>
<Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="preparationAreaDetail"/>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
        <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image ref="prepForm" :src="itemImage" width="100"
                height="100" col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
                @tap="selectPicture('prep', item.preparationAreaId)"/>
            <Button class="button" :text="$t('useCamera')"  col="2" row="1"
                @tap="takePicture('prep', item.preparationAreaId)"/>
        </GridLayout>
        <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
        <RadDataForm ref="itemForm" :source="list[index]"
            :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
        <Label :text="$t('categoriesPrepared')" class="h3" paddingLeft="20"/>
        <RadListView for="cat in categoryList" @loaded="onLoaded"
              @itemTap="onCatTap">
            <v-template>
                <GridLayout columns="50, *, auto" rows="*" class="item"
                    paddingRight="5" paddingLeft="10" paddingTop="10">
                    <Image :src="cat.image"  col="0" class="thumbnail"/>
                    <label :text="cat.categoryName" class="h2" col="1"/>
                </GridLayout>
            </v-template>
        </RadListView>
    </StackLayout>
</Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import PrepCategoryMove from './modalPages/PrepCategoryMove'

export default {
    name: 'PrepDetail',
    mixins: [ imageSelector, general, sideDrawer],
    props: {
        list: Array,
        index: Number
    },
    data() {
        return {
            item: this.list[this.index],
            categoryList: [],
            editedItem: {},
            itemMeta: {
                propertyAnnotations: [
                    { name: 'preparationAreaId', ignore: true},
                    { name: 'image', ignore: true},
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
      onLoaded() {
        if (!this.categoryList.length) {
          this.$backendService.getCategoryList(this.item.preparationAreaId)
          .then(result => { this.categoryList = result.data.categories })
        }
      },
      onItemCommitted(data) {
          this.editedItem = JSON.parse(data.object.editedObject)
      },
      onSaveTap() {
        if (this.editedItem) {
          this.$backendService.updatePreparationArea(this.editedItem)
          this.list.splice(this.index,1,this.editedItem)
        }
        this.hideKeyboard()
        this.$navigateBack()
      },
      onCatTap(args) {
        console.log('===========args' + args.index)
        this.$showModal(PrepCategoryMove, {
            props: {  prepId: this.item.preparationAreaId,
                      catId: this.categoryList[args.index].productCategoryId }})
        .then (result => {
          for (let i=0; i < this.item.categories.length; i++) {
            if (this.categoryList[i].productCategoryId == result) {
              this.categoryList.splice(i,1); break}}
         })
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
                    this.list.splice(this.index,1)}
                this.$navigateBack()
            })
          }
     },
  },
}
</script>
