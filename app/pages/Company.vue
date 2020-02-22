<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :back=true :save="true" 
        :onActionTap="onActionTap"
        header="company"/>
    </ActionBar>
    <GridLayout rows="auto, *" class="p-10">
      <GridLayout width="100%" columns="100,30,*" rows="50,50" row="0">
        <Image ref="itemForm" :src="itemImage" width="100" height="100"
            col="0" row="0" rowSpan="2" padding="10"/>
        <Button class="button" :text="$t('copyFromGal')"
            @tap="selectPicture('company', itemComp.partyId)" col=2 row="0"/>
        <Button class="button" :text="$t('useCamera')"
            @tap="takePicture('company', itemComp.partyId)" col="2" row="1"/>
      </GridLayout>
      <RadDataForm :source="itemComp" row="1"
          :metadata="itemMetaComp" @propertyCommitted="onItemCommitted"/>
    </GridLayout>
   </Page>
</template>

<script>

import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
const platformModule = require("tns-core-modules/platform")
export default {
  name: 'company',
  mixins: [  imageSelector, general ],
  data () {
    return {
      editedItem: null,
      itemComp: Object.assign({},this.$store.getters.company),
      itemMetaComp: {
        propertyAnnotations:[
          { name: 'contactMechId', ignore: true},
          { name: 'partyId', ignore: true},
          { name: 'organizationName', displayName: "Restaurant Name",
              required: true, index: 0},
          { name: 'emailAddress', displayName: 'Email address',
              editor: "Email", index: 1},
          { name: 'currencyId', readOnly: true, index: 2,
              displayName: 'Currency (enter a request to change)'},
        ]
      },
    }
  },
  created() {
    this.$backendService.downloadImage('medium', 'company', this.itemComp.partyId)
      .then(result => {this.itemImage = result.data.imageFile })
  },
  methods: {
    onItemCommitted(data) {
      this.editedItem = JSON.parse(data.object.editedObject)
    },
    onActionTap() {
      if (this.editedItem) {
        console.log("====edited item: " + JSON.stringify(this.editedItem))
        this.$store.dispatch('updateCompany', this.editedItem)
        this.note(this.$t('informationIsUpdated'))
        this.hideKeyboard()}
    },
  }
}
</script>

<style lang="css">
</style>
