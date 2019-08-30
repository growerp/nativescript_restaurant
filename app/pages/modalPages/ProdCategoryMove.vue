<template>
    <page><ModalStack dismissEnabled="true" class="modal-container">
        <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
            <Button text="Cancel" @tap="cancelMove()" class="button"/>
            <Label :text="$t('moveProdCat')" textWrap="true"/>
            <RadListView ref="listView" for="item in items" @itemTap="onItemTap">
                <v-template>
                    <GridLayout columns="50, *, auto" rows="*" class="item"
                        paddingRight="5" paddingLeft="5">
                        <label :text="item.name" class="button" col="1"/>
                    </GridLayout>
                </v-template>
            </RadListView>
        </StackLayout></ModalStack>
    </page>
</template>

<script>
export default {
    name: 'ProdCategoryMove',
    props: [ 'prodId', 'catId'],
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
          param['productId'] = this.prodId
          param['productCategoryId'] = args.item.productCategoryId
          this.$backendService.updateProduct(param)
          this.$modal.close(this.prodId) // to delete from list
      },
      cancelMove() {
          this.$modal.close()
      },
   },
}

</script>

<style>
</style>
