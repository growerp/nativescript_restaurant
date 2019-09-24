<template>
  <Page @loaded="pageLoaded()">
    <ActionBar>
        <GridLayout width="100%" columns="auto, auto, *">
            <Label class="title" text="BACK" col="0" @tap="$navigateBack"/>
            <Label class="title" :text="header" col="1" @tap="onHeaderTap"/>
            <Label class="title" :text="itemCount + $t('items')" col="2" textAlignment = "center"/>
        </GridLayout>
    </ActionBar>

    <GridLayout rows="*,50,this.isSubscribed('noAdds')?0:50">
      <Accordion row="0" height="100%"
          ref="accordion" allowMultiple="true"
          for="item of categoriesAndProducts" childItems="products">
        <v-template name="title">
          <GridLayout columns="50, *" rows="*" class="item"
            :visibility="item.nbrOfProducts!='0'?'visible':'hidden'">
            <Image :src="item.image"  col="0" class="thumbnail"/>
            <Label backgroundColor="rgb(211, 215, 207)" :text="item.categoryName"
                col="1" class="h2" paddingLeft="10"/>
          </GridLayout>
        </v-template>
        <v-template name="content">
            <GridLayout columns="50, *, auto" rows="*" class="item"
               paddingRight="5" paddingLeft="25" @tap="addToOrder(item, 1)">
                <Image :src="item.image"  col="0" class="thumbnail"/>
                <label :text="item.name" class="h2" col="1"/>
                <label :text="item.price" class="p" col="2"/>
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
    mixins: [ general ],
    data() {
			return {
        header: this.$t('orderFor') + this.$t('table') + this.orderHeader.description +
            '-' + this.orderHeader.spotNumber,
        categoriesAndProducts:  this.$store.getters.productCategoriesAndProducts,
        orderItems: [],
        itemCount: 0,
      }
    },
		methods: {
      onHeaderTap() {
        this.$navigateTo(this.$routes.Home)
      },
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
