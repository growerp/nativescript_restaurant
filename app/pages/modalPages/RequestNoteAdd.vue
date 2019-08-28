<template>
    <page>
	     <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <RadDataForm ref="addItem" :source="item" :metadata="itemMeta"
            @propertyCommitted="onCommitted"/>
        <Button class="button" :text="$t('addNote')" @tap="submit"/>
        <Button class="button" :text="$t('cancel')" @tap="$modal.close()"/>
	</StackLayout>
</page>
</template>

<script>
export default {
    name: 'RequestNoteAdd',
    props: {
      requestId: String
    },
    data() {
        return {
            item: { text: '',
            },
            itemMeta: {
                  propertyAnnotations: [
                      { name: 'requestId', ignore: true},
                      { name: 'text', displayName: 'Note',
                            editor: 'MultilineText', required: true},
                      { name: 'date', ignore: true}
                  ]
            },
            editedItem: {},
        }
    },
    methods: {
        onCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        submit() {
            if (this.editedItem != '') {
              this.editedItem.requestId = this.requestId
              this.$backendService.createRequestNote(this.editedItem)
              .then( result => {
                  this.editedItem.date = 'Now'
                  this.editedItem.requestId = this.requestId
                  this.$modal.close(this.editedItem)
              })}
            else this.$modal.close()
        }
    }
}

</script>

<style>
</style>
