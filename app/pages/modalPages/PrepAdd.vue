<template>
  <page>
    <StackLayout backgroundColor="white" width="90%" padding="10">
      <label :text="$t('addPreparationArea')" class="h2" horizontalAlignment="center"/>
      <RadDataForm ref="addPrep" :source="item" :metadata="itemMeta"
          @propertyCommitted="onCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()" col="0"/>
        <Button class="button" :text="$t('addArea')" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
export default {
  name: 'PrepAdd',
  data() {
    return {
      item: { description: '' },
      itemMeta: {
        propertyAnnotations: [
            { name: 'description', required: true, index: 0},
        ]
      },
      editedItem: null,
    }
  },
  methods: {
    onCommitted(data) {
        this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
      if (this.editedItem != '') {
        this.$store.dispatch('createPreparationArea', this.editedItem)
        this.$modal.close()
      }
    }
  }
}

</script>

<style>
</style>
