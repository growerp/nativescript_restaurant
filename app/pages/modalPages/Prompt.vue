<template>
  <page><ModalStack dismissEnabled="true" class="modal-container">
    <StackLayout backgroundColor="white" width="70%" padding="20">
      <label :text="message" class="h3" horizontalAlignment="center"
        padding="20" color="green" textWrap="true"/>
      <RadDataForm :source="itemData"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <GridLayout columns="*,*" rows="auto">
        <Button class="button" :text="$t(cancel)" @tap="$modal.close(false)" col="0"/>
        <Button class="button" :text="$t(ok)" @tap="submit" col="1"/>
      </GridLayout>
    </StackLayout></ModalStack>
  </page>
</template>

<script>
export default {
  name: 'Prompt',
  props: {
    title: String,
    message: String,
    inputType: String,
    defaultText: String,
    cancel: {type: String, default: 'cancel'},
    ok:  {type: String, default: 'ok'}
  },
  data() {
    return {
      editedItem: null,
      itemData: { 
        emailAddress: 
            this.inputType == 'email'? this.defaultText: '',
        text: 
            this.inputType == 'text'? this.defaultText: '',
      },
      itemMeta: {
        propertyAnnotations:[
          { name: 'emailAddress', displayName: this.$t('email'), 
            editor: "Email",
            ignore: this.inputType != 'email'? true : false},
          { name: 'text',  
            ignore: this.inputType != 'text'? true : false},
        ],
      },
    }
  },
  methods: {
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    submit() {
        let field = ''
        if (this.inputType == 'email') {
          if (this.editedItem)
            field = this.editedItem.emailAddress
          else
            field = this.itemData.emailAddress
        } else if (this.inputType == 'text') {
          if (this.editedItem)
            field = this.editedItem.text
          else
            field = this.itemData.text
        }
        if (!field) 
          this.note(this.$t('cannotBeEmpty'))
        else this.$modal.close(field)

    }
  }
}
</script>

<style>
</style>
