<template>
    <page>
	<StackLayout class="p-20" backgroundColor="white" paddingTop="40">
    <Button class="button" :text="$t('cancel')" @tap="cancelMove()"/>
    <Label :text="$t('moveCatProduct')"/>
    <RadListView ref="listViewItem" for="item in items" @itemTap="onItemTap">
        <v-template>
            <GridLayout columns="50, *, auto" rows="*" class="item"
                  paddingRight="5" paddingLeft="5">
                <label :text="item.description" class="h2" col="1"/>
            </GridLayout>
        </v-template>
    </RadListView>
	</StackLayout>
</page>
</template>

<script>
export default {
    name: 'ProdCategoryMove',
    props: [ 'prepId', 'catId'],
    data() {
        return {
            itemsAll: this.$store.getters.prepAreasAndCategories,
            items: [] // list without current one
        }
    },
    created() {
      for (let i=0; i < this.itemsAll.length; i++) {
        if (this.itemsAll[i].preparationAreaId != this.prepId) {
          this.items.push(this.itemsAll[i])}}
    },
    methods: {
      onItemTap(args) {
        this.$backendService.movePreparationAreaCategory(
            this.prepId, args.item.preparationAreaId, this.catId).then(() => {
            this.$backendService.getPrepAreasAndCategories()
            this.$modal.close(this.catId)
        })
      },
      cancelMove() {
          this.$modal.close()
      },
   },
}

</script>

<style>
</style>
