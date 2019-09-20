<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="product.categoryName" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('moveProdCat')" textWrap="true" class="h3"
          horizontalAlignment="center"/>
      <RadListView for="item in items" height="50%"><!-- @itemTap not work on IOS -->
        <v-template>
          <GridLayout columns="50, *, *, auto" rows="*" pading="10"
                @tap="onItemTap(item)">
            <Image :src="item.image"  col="0" height="50"/>
            <StackLayout col="1" paddingLeft="5">
              <label :text="item.name" class="h2"/>
              <label :text="item.categoryName" class="p"/>
            </StackLayout>
            <Label :text="item.price" class="p" col="3"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button :text="$t('cancel')" @tap="$modal.close()" 
          class="button" width="50%"/>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
  export default {
    name: 'ProdCategoryMove',
    props: {
      product: Object,
    },
    data() {
      return {
        items: this.$store.getters.productCategoriesMinusOne(
          this.product.productId)
      }
    },
    methods: {
      onItemTap(catgItem) {
        this.$backendService.updateProduct({
          productId: this.product.productId,
          productCategoryId: catgItem.productCAtegoryId })
        console.log("====update product: " + this.product.name + " old catg:" + this.product.categoryName + " new: " + catgItem.categoryName)
        this.$store.commit('product', {
          verb: 'update',
          productId: this.product.productId,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          productCategoryId: catgItem.productCategoryId,
          categoryName: catgItem.categoryName
        })
        this.$modal.close()
      },
    },
  }
</script>

<style>
</style>
