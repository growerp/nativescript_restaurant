<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="areaDetail"/>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('area', item.accommodationAreaId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('area', item.accommodationAreaId)"/>
      </GridLayout>
      <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
      <RadDataForm ref="itemForm" :source="item"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="title" :text="$t('tableNumbers')"/>
      <RadListView for="table in tableMatrix" @loaded="onLoaded">
        <v-template>
          <GridLayout columns="*, *, *, *" rows="*" class="item">
            <label :text="table[0]?table[0].spotNumber:''" class="h2"
                col="0" horizontalAlignment="center" @tap="onSpotDelete(table[0])"/>
            <label :text="table[1]?table[1].spotNumber:''" class="h2"
                col="1" horizontalAlignment="center" @tap="onSpotDelete(table[1])"/>
            <label :text="table[2]?table[2].spotNumber:''" class="h2"
                col="2" horizontalAlignment="center" @tap="onSpotDelete(table[2])"/>
            <label :text="table[3]?table[3].spotNumber:''" class="h2"
                col="3" horizontalAlignment="center" @tap="onSpotDelete(table[3])"/>
          </GridLayout>
        </v-template>
      </RadListView>
  </StackLayout>
</Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import SpotAdd from './modalPages/SpotAdd'
export default {
  name: 'AccomodationAreaDetail',
  mixins: [ imageSelector, general, sideDrawer],
  props: {
    list: Array,
    index: Number,
  },
  data() {
    return {
      item: this.list[this.index],
      editedItem: {},
      itemMeta: {
        propertyAnnotations: [
            { name: 'accommodationAreaId', ignore: true},
            { name: 'image', ignore: true},
            { name: 'description', required: true, index: 0},
            { name: 'nbrOfSpots', ignore: true}]},
      tables: [],
      tableMatrix: [],
    }
  },
  created() {
    if (!this.itemImage.length) {
      this.$backendService.downloadImage('medium', 'area',
          this.item.accommodationAreaId)
      .then(result => { this.itemImage = result.data.imageFile })}
  },
  methods: {
    onLoaded() {
      if (!this.tables.length) {
        this.$backendService.getAccommodationSpotList(
              this.item.accommodationAreaId)
        .then (result => {
            this.tables = result.data.accommodationSpots
            this.makeTableMatix()})
      }
    },
    onDeleteTap() {
      confirm({
        title: "Delete area '" + this.item.description + "' and related tables?",
        okButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel')
      }).then (data => {
        if (data) {
          this.$backendService.deleteAccommodationArea(
              this.item.accommodationAreaId)
          .then(() => {this.$backendService.getAreasAndSpots()})
          this.list.splice(this.index,1)}
          this.$navigateBack()
      })
    },
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    onSaveTap() {
      if (this.editedItem) {
        this.$backendService.updateAccommodationArea(this.editedItem)
        .then(() => {this.$backendService.getAreasAndSpots()})
        this.list.splice(this.index,1,this.editedItem)
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    onActionTap() {
      this.$showModal(SpotAdd,
            { props: {accommodationAreaId: this.item.accommodationAreaId}})
    },
    makeTableMatix() {
      this.tableMatrix = []
      let record = 0
      while (record < this.tables.length) {
        let tableRecord = []
        for (let count = 0; count < 4 ; count++) {
            let table = {}
            if (this.tables[record]) {
                table = this.tables[record++]
                tableRecord.push(table)
            } else { break}}
        this.tableMatrix.push(tableRecord)}
    },
    onSpotDelete(table) {
      confirm({
          title: this.$t('deleteTable') + table.spotNumber + '?',
          okButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel')
      }).then (data => {
        if (data) {
          this.$backendService.deleteAccommodationSpot(
              this.item.accommodationAreaId, table.accommodationSpotId)
          .then(() => {this.$backendService.getAreasAndSpots()})
          for (let i=0;i<this.tables.length;i++) {
            if (this.tables[i].spotNumber === table.spotNumber) {
                this.tables.splice(i,1); break }}
          this.makeTableMatix()
        }
      })
    }
  }
}
</script>
