<template>
  <page>
    <StackLayout backgroundColor="white" width="80%" class="m-20 p-20">
      <label :text="$t(message)" class="h2 text-center" textWrap="true"/>
      <RadDataForm :source="item" @propertyCommitted="onItemCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close(false)" col="0"/>
        <Button class="button" :text="$t('ok')" 
          @tap="$modal.close(editedItem)" col="1"/>
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
export default {
  name: 'Search',
  props: {
    message: String,
    item: Object
  },
  data() {
    return {
      editedItem: null,
    }
  },
  methods: {
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
  }
}

</script>

<style>
</style>
