<template>
  <Page @loaded="pageLoaded(0)">
      <ActionBar><NavigationButton visibility="collapsed"/>
        <myActionBar :openDrawer="openDrawer" header="setup" 
            :onHeaderTap="onHeaderTapHome"
            :reload="true" :onActionTap="backToDefault"/>
      </ActionBar>
     <GridLayout rows="*, 50" class="p-10">
        <RadListView for="item in dashBoard" @itemTap="onItemTap" row="0"
            itemReorder="true" @itemReordered="onItemReordered"
            layout="grid" itemHeight="100"><!--itemHeight for ios -->
          <v-template>
            <StackLayout orientation="vertical" padding="10">
              <Image :src="item.image" height="60"/>
              <Label :text="item.title" horizontalAlignment="center" class="h3"/>
            </StackLayout>
          </v-template>
        </RadListView>
     </GridLayout>
    </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
const appSettings = require("tns-core-modules/application-settings");

export default {
    name: 'Home',
    data() {
      return {
        dashBoard: [],
      }
    },
    mixins: [ sideDrawer, general],
    created() {
      if (this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN') {
        if (appSettings.getString('setUp'))
          this.dashBoard = JSON.parse(appSettings.getString('setUp'))
        else 
          this.backToDefault()
      }
    },
    methods: {
      onItemReordered(args) {
          appSettings.setString('setUp', JSON.stringify(this.dashBoard))
      },
      backToDefault() { // icons from : https://www.flaticon.com/
        if (this.$store.getters.currentEmployeeUserGroupId === 'GROWERP_M_ADMIN') {
          this.dashBoard = [
          {id: 1, image: '~/assets/images/prep.png', title: this.$t('prepLoc'),
            pageName: 'Locations', pageTab: 0},
          {id: 2, image: '~/assets/images/tables.png', title: this.$t('tables'),
              pageName: 'Locations', pageTab: 1},
          {id: 3, image: '~/assets/images/category.png', title: this.$t('category'),
            pageName: 'Categories', pageTab: 0},
          {id: 4, image: '~/assets/images/product.png', title: this.$t('product'),
              pageName: 'Products', pageTab: 1},
          {id: 5, image: '~/assets/images/users.png', title: this.$t('employee'),
            pageName: 'Organization', pageTab: 1},
          {id: 6, image: '~/assets/images/customers.png', title: this.$t('customer'),
            pageName: 'Organization', pageTab: 2},
          {id: 7, image: '~/assets/images/payment.png', title: this.$t('upgrade'),
              pageName: 'Upgrade', pageTab: 0},
          {id: 8, image: '~/assets/images/about.png', title: this.$t('about'),
            pageName: 'About', pageTab: 0},
          ]
          appSettings.setString('setUp', JSON.stringify(this.dashBoard))
        }
      },
      onItemTap(args) {
          this.$navigateTo(eval("this.$routes." + args.item.pageName),
            {props: { startTab: args.item.pageTab}})
      },
    },
}
</script>

<style lang="css">
</style>
