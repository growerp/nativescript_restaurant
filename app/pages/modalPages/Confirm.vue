<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="70%" padding="20">
      <label :text="message" class="h3" horizontalAlignment="center"
        padding="20" color="red"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t('cancel')" @tap="$modal.close(false)" col="0"/>
        <Button class="button" :text="$t('ok')" @tap="$modal.close(true)" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    message: String
  },
}

</script>

<style>
</style>
