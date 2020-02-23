<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="80%" class="m-20 p-20">
      <label :text="$t(message)" class="h2 text-center" textWrap="true"/>
      <RadDataForm :source="item" @propertyCommitted="onItemCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button :text="$t('cancel')" @tap="$modal.close(false)" col="0"/>
        <Button :text="$t('ok')" 
          @tap="$modal.close(editedItem)" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
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
