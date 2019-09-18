<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="areaDetail"/>
    </ActionBar>
    <StackLayout @longPress="onAreaDeleteTap">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('area', item.accommodationAreaId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('area', item.accommodationAreaId)"/>
      </GridLayout>
      <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
      <RadDataForm :source="Object.assign({},item)"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="title" :text="$t('tableNumbers') + $t('tapToDelete')"/>
      <RadListView for="table in tableMatrix" height="40%">
        <v-template>
          <GridLayout columns="*, *, *, *" rows="*" class="item">
            <label :text="table[0]?table[0].spotNumber:''" class="h2"
                col="0" horizontalAlignment="center" @tap="deleteSpot(table[0])"/>
            <label :text="table[1]?table[1].spotNumber:''" class="h2"
                col="1" horizontalAlignment="center" @tap="deleteSpot(table[1])"/>
            <label :text="table[2]?table[2].spotNumber:''" class="h2"
                col="2" horizontalAlignment="center" @tap="deleteSpot(table[2])"/>
            <label :text="table[3]?table[3].spotNumber:''" class="h2"
                col="3" horizontalAlignment="center" @tap="deleteSpot(table[3])"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addTable')" @tap="addSpot"/>
  </StackLayout>
</Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import SpotAdd from './modalPages/SpotAdd'
export default {
  name: 'AreaDetail',
  mixins: [ imageSelector, general, sideDrawer],
  props: {
    item: Object,
  },
  data() {
    return {
      editedItem: {},
      itemMeta: {
        propertyAnnotations: [
            { name: 'accommodationAreaId', ignore: true},
            { name: 'image', ignore: true},
            { name: 'description', required: true, index: 0},
            { name: 'nbrOfSpots', ignore: true}]},
      tableMatrix: [],
    }
  },
  created() {
    this.$backendService.downloadImage('medium', 'area',
        this.item.accommodationAreaId)
    .then(result => {
      this.itemImage = result.data.imageFile })
    this.makeTableMatix()
  },
  methods: {
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    onSaveTap() {
      if (this.editedItem) {
        this.$backendService.updateAccommodationArea(this.editedItem)
        this.editedItem.verb = 'update'
        this.$store.commit('accommodationArea', this.editedItem)
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    onAreaDeleteTap() {
      confirm({
        title: "Delete area '" + this.item.description + "' and related tables?",
        okButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel')
      }).then (data => {
        if (data) {
          this.$backendService.deleteAccommodationArea(
              this.item.accommodationAreaId)
          this.$store.commit('accommodationArea', {
              verb: 'delete',
              accommodationAreaId: this.item.accommodationAreaId })
          this.$navigateBack()
        }
      })
    },
    addSpot() {
      this.$showModal(SpotAdd,
            { props: {accommodationAreaId: this.item.accommodationAreaId}})
      .then(() => {
        console.log("====return: " + JSON.stringify(this.$store.getters.
              accommodationSpotsByAreaId(this.item.accommodationAreaId)))
        this.makeTableMatix()
      })
    },
    deleteSpot(table) {
      confirm({
          title: this.$t('deleteTable') + table.spotNumber + '?',
          okButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel')
      }).then (data => {
        if (data) {
          this.$backendService.deleteAccommodationSpot(
              this.item.accommodationAreaId, table.accommodationSpotId)
          this.$store.commit('accommodationSpot', {
            verb: 'delete',
            accommodationSpotId: table.accommodationSpotId})
          this.makeTableMatix()
        }
      })
    },
    makeTableMatix() {
      let tables =  this.$store.getters.
              accommodationSpotsByAreaId(this.item.accommodationAreaId)
      this.tableMatrix = []
      let record = 0
      while (record < tables.length) {
        let tableRecord = []
        for (let count = 0; count < 4 ; count++) {
            let table = {}
            if (tables[record]) {
                table = tables[record++]
                tableRecord.push(table)
            } else { break}}
        this.tableMatrix.push(tableRecord)}
    },
  }
}
</script>
