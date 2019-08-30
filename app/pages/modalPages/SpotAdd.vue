<template>
    <page><ModalStack dismissEnabled="true" class="modal-container">
        <StackLayout class="p-20" backgroundColor="white" paddingTop="40">
            <label :text="$t('addTable')" class="h2" horizontalAlignment="center"/>
            <RadDataForm ref="addSpot" :source="item"
                @propertyCommitted="onCommitted"/>
            <Button class="button" :text="$t('addTable')" @tap="submit" />
            <Button class="button" :text="$t('cancel')" @tap="$modal.close()" />
        </StackLayout></ModalStack>
    </page>
</template>

<script>
export default {
    props: {
        accommodationAreaId: String
    },
    data() {
        return {
            item: {
                spotNumber: '',
            },
            editedItem: {},
        };
    },
    methods: {
        onCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        submit() {
            if (this.editedItem != '') {
                this.$backendService.createAccommodationSpot(
                    this.accommodationAreaId,
                    this.editedItem.spotNumber)}
            this.$modal.close()
        }
    }
}

</script>

<style>
</style>
