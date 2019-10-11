<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="areaDetail"/>
    </ActionBar>
    <GridLayout rows="auto, auto, auto,*, auto, 50">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" 
            padding="20" row="0">
        <Image ref="areaForm" :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('area', item.accommodationAreaId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('area', item.accommodationAreaId)"/>
      </GridLayout>
      <RadDataForm :source="Object.assign({},item)" row="1"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
      <Label class="h3"  row="2" paddingLeft="15"
            :text="$t('tableNumbers') + $t('tapLongToDelete')"/>
      <RadListView for="table in tableMatrix" row="3">
        <v-template>
          <GridLayout columns="*, *, *, *" rows="*" class="item">
            <label :text="table[0]?table[0].spotNumber:''" class="h2"
                col="0" horizontalAlignment="center"
                @longPress="deleteSpot(table[0])"/>
            <label :text="table[1]?table[1].spotNumber:''" class="h2"
                col="1" horizontalAlignment="center"
                @longPress="deleteSpot(table[1])"/>
            <label :text="table[2]?table[2].spotNumber:''" class="h2"
                col="2" horizontalAlignment="center"
                @longPress="deleteSpot(table[2])"/>
            <label :text="table[3]?table[3].spotNumber:''" class="h2"
                col="3" horizontalAlignment="center"
                @longPress="deleteSpot(table[3])"/>
          </GridLayout>
        </v-template>
      </RadListView>
      <Button class="button" :text="$t('addTable')" @tap="addSpot" 
            row="4" width="50%"/>
  </GridLayout>
</Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import SpotAdd from './modalPages/SpotAdd'
import Confirm from './modalPages/Confirm'

export default {
  name: 'AreaDetail',
  mixins: [ imageSelector, general, sideDrawer],
  props: {
    item: Object,
  },
  data() {
    return {
      editedItem: null,
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
        this.$store.dispatch('updateAccommodationArea', this.editedItem)
      }
      this.hideKeyboard()
      this.$navigateBack()
    },
    addSpot() {
      console.log("=====display modal")
      this.$showModal(SpotAdd, { props: { accommodationArea: this.item}})
      .then(() => {
        console.log("=====make tablel")
        this.makeTableMatix()
        console.log("===table finished")
      })
    },
    deleteSpot(table) {
      this.$showModal(Confirm,{ props: {
          message: this.$t('deleteTable') + table.spotNumber + '?'}})
      .then (data => {
        if (data) {
          this.$store.dispatch('deleteAccommodationSpot', {
              spotId: table.accommodationSpotId,
              areaId: table.accommodationAreaId})
          this.makeTableMatix()
        }
      })
    },
    makeTableMatix() {
      let tables = this.$store.getters.
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
