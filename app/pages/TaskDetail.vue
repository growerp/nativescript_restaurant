<template>
  <Page @loaded="pageLoaded(0)">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :save="true" :back="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="taskDetail"/>
    </ActionBar>
    <StackLayout>
      <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
        <Image  :src="itemImage" width="100"
            height="100" col="0" row="0" rowSpan="2"/>
        <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
            @tap="selectPicture('task', item.workEffortId)"/>
        <Button class="button" :text="$t('useCamera')"  col="2" row="1"
            @tap="takePicture('task', item.workEffortId)"/>
      </GridLayout>
      <RadDataForm ref="itemForm" :source="itemData"
          :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'
const platformModule = require("tns-core-modules/platform")
export default {
  name: 'TaskDetail',
  mixins: [ imageSelector,general, sideDrawer ],
  props: {
      item: Object,
  },
  data() {
    return {
      editedItem: null,
      employeeNames: this.$store.getters.employeeDesc(true),
      priorities: [1,2,3,4,5],
      statusList: [this.$t('WeApproved'),
                  this.$t('WeCompleted'),
                  this.$t('WeCancelled')],
      itemData: Object.assign({}, this.item),
      itemMeta: {
        propertyAnnotations: [
          { name: 'workEffortId', ignore: true},
          { name: 'ownerPartyId', ignore:true},
          { name: 'ownerFullName', ignore:true},
          { name: 'image', ignore: true},
          { name: 'workEffortName', displayName: this.$t('title'),
              required: true, index: 0},
          { name: 'description', editor: 'MultilineText', index: 2},
          { name: 'priority', editor: 'Picker', index: 3,
              valuesProvider: [1,2,3,4,5]},
          { name: 'userPartyId', ignore: true},
          { name: 'userFullName', displayName: this.$t('assignedTo'),
            index: 4, editor: 'Picker',
            valuesProvider: this.$store.getters.employeeDesc(true) },
          { name: 'statusId', index: 5, editor: 'Picker',
            valuesProvider:  [this.$t('WeApproved'),
                  this.$t('WeCompleted'),
                  this.$t('WeCancelled')]
          }
        ],
      },
    }
  },
  created() {
    this.$backendService.downloadImage('medium', 'task',
        this.item.workEffortId)
    .then(result => {
      this.itemImage = result.data.imageFile})
    this.itemData.statusId = this.$t(this.itemData.statusId)
    if (platformModule.isIOS) { // returns an index instead of value so change
      this.itemData.userFullName = this.employeeNames.findIndex(
          o => o === this.itemData.userFullName)}
  },
  methods: {
      onItemCommitted(data) {
          this.editedItem = JSON.parse(data.object.editedObject)
      },
      onSaveTap() {
        if (this.editedItem) {
          if (!this.editedItem.workEffortName)
              this.note(this.$t('titleIsRequired'))
          else {
            // usernames
            if (platformModule.isIOS) { // returns an index instead of value so change
              this.editedItem.userFullName = 
                  this.employeeNames[parseInt(this.editedItem.userFullName,10)]
              this.editedItem.statusId = 
                  this.statusList[parseInt(this.editedItem.statusId,10)]
              this.editedItem.priority = 
                  this.priorities[parseInt(this.editedItem.priority,10)]
            }
            this.editedItem.userPartyId = this.$store.getters.
              employeeByDesc(this.editedItem.userFullName).partyId
            let status = [this.$t('WeApproved'), this.$t('WeCompleted'),
                    this.$t('WeCancelled')]
            switch(this.editedItem.statusId) {
              case this.$t('WeApproved'): 
                  this.editedItem.statusId = 'WeApproved';break
              case this.$t('WeCancelled'): 
                  this.editedItem.statusId = 'WeCancelled';break
              case this.$t('WeCompleted'): 
                  this.editedItem.statusId = 'WeCompleted';break}
            // update remote and local
            this.$backendService.updateTask(this.editedItem)
            this.editedItem.verb = 'update'
            this.$store.commit('task', this.editedItem)
          }
          this.hideKeyboard()
        }
        this.$navigateBack()
      },
    }
  }
</script>
