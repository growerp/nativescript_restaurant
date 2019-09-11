<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="90%" padding="20">
      <Label :text="name" horizontalAlignment="center" class="h2"/>
      <Label :text="$t('movePrepCat')" textWrap="true" class="h3"
          horizontalAlignment="center" padding="10"/>
      <RadListView for="item in items" @itemTap="onItemTap" height="50%">
        <v-template>
          <GridLayout columns="50, *, auto" rows="*">
            <Image :src="item.image"  col="0" class="thumbnail"/>
            <label :text="item.description" class="h2" col="1"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button :text="$t('cancel')" @tap="$modal.close()" class="button"/>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
    name: 'PrepCategoryMove',
    props: {
      prepId: String,
      catId : String,
      name: String
    },
    data() {
      return {
        itemsAll: this.$store.getters.prepAreasAndCategories(),
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
        console.log("===move: args" + args.item.description)
        this.$backendService.movePreparationAreaCategory(
            this.prepId, args.item.preparationAreaId, this.catId)
        .then(() => {
          this.$backendService.getPrepAreasAndCategories()
          .then(() => {
            this.$modal.close(this.catId)
          })})
      },
   },
}

</script>

<style>
</style>
