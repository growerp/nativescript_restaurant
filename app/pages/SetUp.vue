<template>
  <Page @loaded="pageLoaded(0)">
      <ActionBar>
        <GridLayout width="100%" columns="auto, *,auto">
            <Image src="~/assets/images/menu.png" height="20" @tap="openDrawer()" col="0"/>
            <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)" col="1"
                horizontalAlignment="center">
              <Image src="~/assets/images/go-back-arrow.png" height="15"/>
              <Label class="title" :text="$t('setup')"/>
            </StackLayout>
            <!--Label class="title" :text="$t('backToDefault')" col="2"
                @tap="backToDefault"/-->
        </GridLayout>
      </ActionBar>
      <StackLayout padding="20" width="1000">
        <RadListView ref="listView" for="item in dashBoard" @itemTap="onItemTap"
            itemReorder="true" @itemReordered="onItemReordered" layout="grid" itemHeight="120"><!--itemHeight for ios -->
          <v-template>
              <StackLayout orientation="vertical" padding="10">
                <Image :src="item.image" height="60"/>
                <Label :text="item.title" horizontalAlignment="center" class="h3"/>
              </StackLayout>
          </v-template>
        </RadListView>
      </StackLayout>
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
    methods: {
      onItemReordered(args) {
          var index = args.index, data = args.data, object = args.object;
          appSettings.setString('setUp', JSON.stringify(this.dashBoard))
      },
      onItemTap(args) {
          this.$navigateTo(eval("this.$routes." + args.item.pageName),{props: { startTab: args.item.pageTab}})
      },
      backToDefault() { // icons from : https://www.flaticon.com/
        const platformModule = require("tns-core-modules/platform");
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
      },
    },
    created() {
      this.hideKeyboard()
//      this.dashBoard = JSON.parse(appSettings.getString('setUp'))
//    if (!this.dashBoard) { this.backToDefault() }
      this.backToDefault()
    },
}
</script>

<style lang="css">
</style>
