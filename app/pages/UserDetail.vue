<template>
<Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *,auto">
          <Label class="title" text="BACK" col="0" @tap="$navigateBack"/>
          <StackLayout orientation="horizontal" @tap="$navigateTo($routes.SetUp)" col="1"
              horizontalAlignment="center">
            <Image src="~/assets/images/go-back-arrow.png" height="15"/>
            <Label class="title" :text="heading" col="1"
                  @tap="$navigateTo($routes.Organization,{props:{startTab: 2}})"/>
          </StackLayout>
          <Label @tap="onSaveTap" :text="$t('save')" col="2"/>
      </GridLayout>
    </ActionBar>
    <StackLayout @longPress="onDeleteTap">
        <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
            <Image ref="itemForm" :src="itemImage" width="100" height="100"
                col="0" row="0" rowSpan="2"/>
            <Button class="button" :text="$t('copyFromGal')"
                @tap="selectPicture('user', item.partyId)" col=2 row="0"/>
            <Button class="button" :text="$t('useCamera')"
                @tap="takePicture('user', item.partyId)" col="2" row="1"/>
        </GridLayout>
        <Label :text="$t('longToDelete')" horizontalAlignment="center" class="p"/>
        <RadDataForm ref="itemForm" :source="item"
            :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
        <Button class="button" :text="$t('updatePassword')" @tap="onPasswordTap"
          :visibility="this.$store.getters.user.userGroupId==='GROWERP_M_ADMIN'?'visible':'hidden'"/>
    </StackLayout>
</Page>
</template>

<script>
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import passwordUpdate from './modalPages/PasswordUpdate'
export default {
    name: 'UserDetail',
    mixins: [ imageSelector, general ],
    props: {
      list: Array,
      index: Number,
      roleTypeId: String,
    },
    data() {
        return {
            heading: this.$t(this.roleTypeId.toLowerCase()) + ' ' + this.$t('detailedInfo'),
            item: this.list[this.index],
            editedItem: {},
            itemMeta: {
                propertyAnnotations:[
                    { name: 'partyId', hidden: true, ignore: true},
                    { name: 'locale', hidden: true, ignore: true},
                    { name: 'roleTypeId', hidden: true, ignore: true},
                    { name: 'firstName', required: true, index: 0},
                    { name: 'lastName', required: true, index: 1},
                    { name: 'username', displayName: this.$t('loginName'),
                        required: true, index: 2, hidden: this.roleTypeId==='Customer', ignore: this.roleTypeId==='Customer'},
                    { name: 'email', displayName: this.$t('email'), required: true,
                        editor: "Email", index: 4},
                    { name: 'image', hidden: true, ignore: true},
                    { name: 'externalId', hidden: this.roleTypeId!=='Customer', ignore: this.roleTypeId!=='Customer', index: 5},
                    { name: 'userId', hidden: true, ignore: true},
                    { name: 'userGroupId', hidden: true, ignore: true},
                    { name: 'groupDescription', index: 6, displayName: this.$t('userGroup'),
                        valuesProvider: this.$store.getters.userGroupValues,
                        editor: 'Picker', readOnly: this.$store.getters.user.userGroupId != 'GROWERP_M_ADMIN'},
                  ],
            },
        }
    },
    created() {
      if (!this.itemImage.length) {
        this.$backendService.downloadImage('medium', 'user', this.item.partyId)
        .then(result => { this.itemImage = result.data.imageFile})}
    },
    methods: {
        onDeleteTap() {
            prompt({
                title: this.$t('deleteSmall') + this.roleTypeId + ' ' +
                  this.item.firstName + ' ' + this.item.lastName + "?",
                okButtonText: "Ok",
                cancelButtonText: this.$t('cancel')
            }).then (data => {
                if (data.result == true) {
                    this.$backendService.deleteUser(this.item.partyId)
                    this.list.splice(this.index,1)}
                this.$navigateBack()})
        },
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onSaveTap() {
          if (this.editedItem && this.editedItem.partyId) {
            this.$backendService.updateUser(this.editedItem)
            this.list.splice(this.index,1,this.editedItem)
            this.hideKeyboard()
            if (this.$store.getters.user.partyId === this.list[this.index].partyId) {
                this.$store.commit('username', this.editedItem.username) }
          }
          this.$navigateBack()
        },
        onPasswordTap() {
          this.$showModal(passwordUpdate, {props: {username: this.item.username,
                fullName: this.item.firstName + ' ' + this.item.lastName }})
        }
    }
}
</script>
