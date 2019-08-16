<template lang="html">
    <Page>
        <ActionBar>
          <GridLayout width="100%" columns="auto, *, auto">
            <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
            <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)" col="1"
                horizontalAlignment="center">
              <Image src="~/assets/images/go-back-arrow.png" height="15"/>
              <Label class="title" :text="$t('myInfoLong')"/>
            </StackLayout>
            <Label :text="$t('save')" @tap="onSaveTap" col="2"/>
          </GridLayout>
        </ActionBar>
        <StackLayout>
            <GridLayout width="100%" columns="100,30,*" rows="50,50" padding="20">
                <Image ref="itemForm" :src="itemImage" width="100" height="100"
                    col="0" row="0" rowSpan="2"/>
                <Button class="button" :text="$t('copyFromGal')"
                    @tap="selectPicture('user', item.partyId)" col=2 row="0"/>
                <Button class="button" :text="$t('useCamera')"
                    @tap="takePicture('user', item.partyId)" col="2" row="1"/>
            </GridLayout>
            <RadDataForm ref="itemForm" :source="item"
                :metadata="itemMeta" @propertyCommitted="onItemCommitted"/>
            <Button class="button" :text="$t('updatePassword')" @tap="onPasswordTap"/>
        </StackLayout>
    </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import imageSelector from '~/mixins/imageSelector'
import general from '~/mixins/general'
import passwordUpdate from './modalPages/PasswordUpdate'

export default {
    name: 'MyInfo',
    mixins: [ sideDrawer, imageSelector, general ],
    data () {
        return {
            item: this.$store.getters.user,
            itemImage: '',
            editedItem: {},
            itemMeta: {
                propertyAnnotations:[
                    { name: 'partyId', hidden: true, ignore: true},
                    { name: 'externalId', hidden: true, ignore: true},
                    { name: 'firstName', required: true, displayName: this.$t('firstName'), index: 0},
                    { name: 'lastName', required: true, displayName: this.$t('lastName'), index: 1},
                    { name: 'username', displayName: this.$t('loginName'),
                        required: true, index: 2, hidden: this.roleTypeId==='Customer' , ignore: this.roleTypeId==='Customer'},
                    { name: 'email', required: true, displayName: this.$t('email'),
                        editor: "Email", index: 4,},
                    { name: 'image', hidden: true, ignore: true},
                    { name: 'userId', hidden: true, ignore: true},
                    { name: 'locale', hidden: true, ignore: true},
                    { name: 'userGroupId', hidden: true, ignore: true},
                    { name: 'groupDescription', displayName: this.$t('userGroup'), index: 5,
                        editor: 'Picker', valuesProvider: this.$store.getters.userGroupValues,
                        readOnly: this.$store.getters.user.userGroupId != 'GROWERP_M_ADMIN'},
                ],
            },
        }
    },
    created() {
        this.$backendService.downloadImage('medium', 'user', this.$store.getters.user.partyId)
        .then(result => {this.itemImage = result.data.imageFile})
    },
    methods: {
        onItemCommitted(data) {
            this.editedItem = JSON.parse(data.object.editedObject)
        },
        onPasswordTap() {
          this.$showModal(passwordUpdate, {props: {username: this.item.username,
                fullname: this.item.firstName + ' ' + this.item.lastName}})
        },
        onSaveTap() {
          if (this.editedItem && this.editedItem.partyId) {
            this.$backendService.updateUser(this.editedItem)
            this.note(this.$t('informationIsUpdated'))
            this.hideKeyboard()}
        }
    }
}
</script>

<style lang="css">
</style>
