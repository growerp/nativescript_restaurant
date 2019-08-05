<template>
    <page>
	<StackLayout class="p-20" backgroundColor="white" paddingTop="40">
        <RadDataForm ref="addSpot" :source="item"
            @propertyCommitted="onCommitted"/>
        <Button class="btn btn-outline" text="Add Table" @tap="submit" />
        <Button class="btn btn-outline" :text="$t('cancel')" @tap="$modal.close()" />
	</StackLayout>
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
