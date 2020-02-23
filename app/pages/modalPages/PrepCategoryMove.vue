<template>
  <page>
    <ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="item.categoryName" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('movePrepCat')" textWrap="true" class="h3"
          horizontalAlignment="center" padding="10"/>
      <RadListView for="item in items" height="50%"><!-- @itemTap not work on IOS -->
        <v-template>
          <GridLayout columns="50, *, auto" rows="*" padding="10"
                @tap="onItemTap(item)">
            <Image :src="item.image" col="0" class="thumbnail"/>
            <label :text="item.description" class="h2" col="1"
              paddingLeft="10"/>
            <label :text="item.nbrOfCatg" class="h2" col="2"
                  :visibility="item.nbrOfCatg>0?'visible':'hidden'"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button :text="$t('cancel')"
            @tap="$modal.close()" width="50%"/>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  name: 'PrepCategoryMove',
  props: {
    productCategory: Object
  },
  data() {
    return {
      item: Object.assign({},this.productCategory),
      items: this.$store.getters.preparationAreasMinusOne(
          this.productCategory.preparationAreaId)
    }
  },
  methods: {
    onItemTap(preparationItem) {
      this.$store.dispatch('updateProductCategory', {
        productCategoryId: this.productCategory.productCategoryId,
        preparationAreaId: preparationItem.preparationAreaId })
      this.$modal.close()
    }
  },
}

</script>

<style>
</style>
