<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back="true"
          
          :headerNoI18n="header"/>
    </ActionBar>
    <GridLayout rows="*,50,90">
      <Accordion row="0" height="100%"
          ref="accordion" allowMultiple="true"
          for="item of categoriesAndProducts" childItems="products">
        <v-template name="title">
          <GridLayout columns="50, *" rows="*" class="item"
              :visibility="item.nbrOfProducts!='0'?'visible':'hidden'">
            <Image :src="item.image"  col="0" class="thumbnail" height="30"/>
            <Label backgroundColor="rgb(211, 215, 207)" 
                :text="item.categoryName"
                col="1" class="h3" paddingLeft="10"/>
          </GridLayout>
        </v-template>
        <v-template name="content">
          <GridLayout columns="50, *, auto" rows="*" class="item"
                paddingRight="5" paddingLeft="25" @tap="addToOrder(item, 1)">
            <Image :src="item.image" col="0" class="thumbnail" height="30"/>
            <label :text="item.name" class="h3" col="1"/>
            <label :text="item.price" class="h3" col="2"/>
          </GridLayout>
        </v-template>
      </Accordion>
      <GridLayout columns="auto,auto,*" row="1">
        <Button class="button" col="0" text="Expand" 
          width="25%" @tap="expandAll"/>
        <Button class="button" col="1" text="Collapse" 
          width="25%" @tap="collapseAll"/>
        <Button class="button" col="2" text="Continue" 
          width="50%" @tap="goToItems()"/>
      </GridLayout>
    </GridLayout>
</Page>
</template>

<script>
import general from '~/mixins/general'


export default {
  name: 'OrderEntry',
  props: {
      orderHeader: {}
  },
  mixins: [  general ],
  data() {
    return {
      header: this.$t('orderFor') + this.$t('table') + 
          this.orderHeader.description +
          '-' + this.orderHeader.spotNumber,
      categoriesAndProducts:  this.$store.getters.productCategoriesAndProducts,
      orderItems: [],
      itemCount: 0,
    }
  },
  methods: {
    getOrderitems() {
      let items = this.orderItems.length
      for (let i = 0; i < items; i++) {
          this.itemCount += this.orderItems[i].quantity }
    },
    goToItems() {
      this.$navigateTo(this.$routes.OrderItems,
        {props: { orderHeader: this.orderHeader,
                  orderItems: this.orderItems}})
    },
    addToOrder(product,quantity) {
      this.itemCount++
      let i = 0
      for (i = 0; i < this.orderItems.length; i++) {
          if (product.productId === this.orderItems[i].productId) {
            this.orderItems[i].quantity += quantity;
            this.getOrderitems
            this.note(product.name + this.$t('nowQuantity') + this.orderItems[i].quantity)
            break}}
      if (i === this.orderItems.length) {
          product.quantity = quantity
          this.orderItems.push(product)
          this.note(product.name + this.$t('added'))}
    },
    expandAll() { this.$refs.accordion.nativeView.expandAll();},
    collapseAll() { this.$refs.accordion.nativeView.collapseAll()},
  }
}
</script>

<style lang="css">

</style>
