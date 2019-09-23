<template>
  <Page>
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapSetUp" :save="true"
          :onActionTap="onSaveTap" :openDrawer="openDrawer" header="taskDetail"/>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
        <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image  :src="itemImage" width="100"
                height="100" col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"  col=2 row="0"
                @tap="selectPicture('task', item.workEffortId)"/>
            <Button class="button" :text="$t('useCamera')"  col="2" row="1"
                @tap="takePicture('task', item.workEffortId)"/>
        </GridLayout>
        <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
        <RadDataForm ref="itemForm" :source="item"
            :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
    </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'
const priority = [1,2,3,4,5]
export default {
    name: 'TaskDetail',
    mixins: [ imageSelector,general, sideDrawer ],
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
                    { name: 'workEffortId', ignore: true},
                    { name: 'image', ignore: true},
                    { name: 'workEffortName', displayName: this.$t('title'),
                        required: true, index: 0},
                    { name: 'description', editor: 'MultilineText', index: 2},
                    { name: 'priority', editor: 'Picker', index: 3,
                        valuesProvider: priority},
                    { name: 'userPartyId', ignore: true},
                    { name: 'fullName', displayName: this.$t('assignedTo'),
                      index: 4, editor: 'Picker',
                      valuesProvider: this.$store.getters.userNames },
                    { name: 'statusId', index: 5, editor: 'Picker',
                      valuesProvider:  [this.$t('WeApproved'), this.$t('WeCompleted'),
                        this.$t('WeCancelled')]
 }
                ],
            },
            itemImage: '',
        }
    },
    mounted() {
      if (!this.itemImage.length) {
        this.$backendService.downloadImage('medium', 'task',
            this.item.workEffortId)
        .then(result => {
          this.itemImage = result.data.imageFile})
        this.list[this.index].statusId = this.$t(this.list[this.index].statusId)
      }
    },
    methods: {
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onSaveTap() {
          if (this.editedItem) {
            if (!this.editedItem.workEffortName) this.note(this.$t('titleIsRequired'))
            else {
              // usernames
              const platformModule = require("tns-core-modules/platform")
              if (platformModule.isIOS) { // returns an index instead of value so change
                let values = this.$store.getters.userNames
                this.editedItem.fullName = values[parseInt(this.editedItem.fullName,10)]}
              this.editedItem.partyId = this.$store.getters.
                  userByFirstLastName(this.editedItem.fullName)
              // status
              if (platformModule.isIOS) { // returns an index instead of value so change
                let status = [this.$t('WeApproved'), this.$t('WeCompleted'),
                        this.$t('WeCancelled')]
                this.editedItem.statusId = status[parseInt(this.editedItem.statusId,10)]}
              switch(this.editedItem.statusId) {
                case this.$t('WeApproved'): this.editedItem.statusId = 'WeApproved';break
                case this.$t('WeCancelled'): this.editedItem.statusId = 'WeCancelled';break
                case this.$t('WeCompleted'): this.editedItem.statusId = 'WeCompleted';break}
              // priority
              if (platformModule.isIOS) { // returns an index instead of value so change
                this.editedItem.priority = priority[parseInt(this.editedItem.priority,10)]}
              // update remote and local
              console.log("====update task: " + JSON.stringify(this.editedItem))
              this.$backendService.updateTask(this.editedItem)
              this.list.splice(this.index,1,this.editedItem)
              if (this.list.length > 1 && 
                  this.list[this.index].priority !== this.editedItem.priority) { // re-sort if priority changed
                this.list.sort(function (a, b) {
                  return (a.priority + a.workEffortName.toLowerCase())
                      .localeCompare(b.priority + b.workEffortName.toLowerCase())
                })
              }
            }
            this.hideKeyboard()
          }
          this.$navigateBack()
        },
        onDeleteTap() {
          this.$showModal(Confirm,{ props: {
              message: this.$t('deleteTask') + this.item.workEffortName + "?"}
          }).then (data => {
            if (data) {
              this.$backendService.deleteTask(this.item.workEffortId)
              this.list.splice(this.index,1)}
            this.$navigateBack()
          })
        },
      }
  }
</script>
