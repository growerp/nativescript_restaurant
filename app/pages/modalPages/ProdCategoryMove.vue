<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="name" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('moveProdCat')" textWrap="true" class="h3"
          horizontalAlignment="center"/>
      <RadListView for="item in items" @itemTap="onItemTap" height="50%">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*">
            <Image :src="item.image" col="0"/>
            <Label :text="item.name" class="h2" col="1"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button :text="$t('cancel')" @tap="$modal.close()" class="button"/>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  export default {
    name: 'ProdCategoryMove',
    props: {
      prodId: String,
      catId: String,
      name: String,
    },
    data() {
      return {
          items: []
      }
    },
    created() {
      let itemsAll = this.$store.getters.categoriesAndProducts
      for (let i=0; i < itemsAll.length; i++) {
        if (itemsAll[i].productCategoryId != this.catId) {
          this.items.push(itemsAll[i])}}
    },
    methods: {
      onItemTap(args) {
        let param = {}
        param.productId = this.prodId
        param.productCategoryId = args.item.productCategoryId
        this.$backendService.updateProduct(param)
        this.$store.commit('categoryAndProduct',{ 
              oldProductCategoryId: this.catId,
              productCategoryId: args.item.productCategoryId,
              products: [{productId: this.prodId}],
              })
        this.$modal.close() // to delete from list
      },
    },
  }

</script>

<style>
</style>
