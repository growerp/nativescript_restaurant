<template lang="html">
  <ScrollView>
    <StackLayout width="100%">
      <Label class="drawer-header" :text="$t('drawer')" @tap="closeDrawer()"/>

      <Label
        v-for="(page, i) in pages"
        @tap="menuAction(page.component, page.action)"
        class="drawer-item"
        :text="page.title"
        :key="i"
        v-show="page.show==='employee' || (page.show==='admin' && $store.getters.user.userGroupId==='GROWERP_M_ADMIN')"
       />

      <Button class="drawer-close-button" @tap="closeDrawer()">{{ $t("closeDrawer") }}</Button>
    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import {exit} from 'nativescript-exit'

export default {
  mixins: [sideDrawer],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      pages: [
        { title: this.$t("operationalMenuTitle"), show: true},
        { name: 'Home', title: this.$t('dashBoard'), component: this.$routes.Home, action: '', show: 'employee'},
        { name: 'Orders', title: this.$t('orders'), component: this.$routes.Orders, action: '', show: 'employee'},
        { name: 'Prepare', title: this.$t('preparation'), component: this.$routes.Prepare, action: '', show: 'employee'},
        { name: 'Reports', title: this.$t('reports'), component: this.$routes.Reports, action: '', show: 'employee'},
        { name: 'Help', title: this.$t('help'), component: this.$routes.Help, action: '', show: 'employee'},
        { name: 'Tasks', title:this.$t('tasks'), component: this.$routes.Tasks, action: '', show: 'employee'},
        { name: 'MyInfo', title: this.$t('myInfo'),  component: this.$routes.MyInfo, action: '', show: 'employee'},
        { name: 'Logout', title: this.$t('logout'),  component: this.$routes.Login, action: 'Logout', show: 'employee'},
        { title: this.$t("setUpMenuTitle"), show: 'admin' },
        { name: 'Organization', title: this.$t('companyEmplCust'), component: this.$routes.Organization, action: '', show: 'admin'},
        { name: 'Locations', title: this.$t('locations'), component: this.$routes.Locations, action: '', show: 'admin'},
        { name: 'Products', title: this.$t('products'), component: this.$routes.Products, action: '', show: 'admin'},
        { name: 'Categories', title: this.$t('categories'), component: this.$routes.Categories, action: '', show: 'admin'},
        { name: 'About', title: this.$t('about'), component: this.$routes.About, action: '', show: 'admin'},
      ]
    }
  },
  methods: {
    menuAction(pageComponent, action) {
        if (action == 'Logout') {
            const platformModule = require("tns-core-modules/platform");
            if (platformModule.isAndroid) {
              this.$i18n.locale = java.util.Locale.getDefault().getLanguage();
            }
            if (platformModule.isIOS) {
              this.$i18n.locale = NSLocale.preferredLanguages.firstObject;
            }
            console.log('logging out....')
//            this.$backendService.logout()
//            .then(() =>{
              this.$store.commit('apiKey', '') //clear old key
              console.log('logged out')
//            })
//            exit() // exit caused update of apiKey to be ignored
        }
        // use the manual navigation method
        this.$navigateTo(pageComponent)
        // and we probably want to close the drawer when changing pages
        this.closeDrawer()
    }
  }
}
</script>

<style lang="css">
</style>
