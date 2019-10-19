<template>
  <ScrollView>
    <StackLayout width="100%">
      <Image src='~/assets/images/growerp.png' height="70" class="m-10"
          @tap="closeDrawer()"/>
      <StackLayout orientation="horizontal" class="m-5"
        v-for="(page, i) in pages" 
        v-show="page.show==='employee' || (page.show==='admin' && 
            $store.getters.currentEmployeeUserGroupId==='GROWERP_M_ADMIN')"
          :key="i">
        <Image :src="page.image" height="30"/>
        <Label
          @tap="menuAction(page.component, page.action)"
          class="h3 m-5"
          :text="page.title" textWrap="true"
        />
      </StackLayout>
      <Button class="drawer-close-button" 
        @tap="closeDrawer()">{{ $t("closeDrawer") }}</Button>
    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import {exit} from 'nativescript-exit'
const appSettings = require("tns-core-modules/application-settings")

export default {
  mixins: [sideDrawer],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      pages: [
        { image: '~/assets/images/home.png', title: this.$t('dashBoard'),
            component: this.$routes.Home, action: '', show: 'employee'},
        { image: '~/assets/images/waiter.png', title: this.$t('orders'),
            component: this.$routes.Orders, action: '', show: 'employee'},
        { image: '~/assets/images/prep.png', title: this.$t('preparation'), 
            component: this.$routes.Prepare, action: '', show: 'employee'},
        { image: '~/assets/images/report.png', title: this.$t('reports'), 
            component: this.$routes.Reports, action: '', show: 'employee'},
        { image: '~/assets/images/help.png', title: this.$t('help'),
            component: this.$routes.Help, action: '', show: 'employee'},
        { image: '~/assets/images/task.png', title:this.$t('tasks'),
            component: this.$routes.Tasks, action: '', show: 'employee'},
        { image: '~/assets/images/myInfo.png', title: this.$t('myInfo'), 
            component: this.$routes.MyInfo, action: '', show: 'employee'},
        { image: '~/assets/images/logout.png', title: this.$t('logout'),
            component: this.$routes.Login, action: 'Logout', show: 'employee'},
        { image: '~/assets/images/company.png', title: this.$t('companyEmplCust'),
            component: this.$routes.Organization, action: '', show: 'admin'},
        { image: '~/assets/images/locations.png', title: this.$t('locations'),
            component: this.$routes.Locations, action: '', show: 'admin'},
        { image: '~/assets/images/product.png', title: this.$t('products'),
            component: this.$routes.Products, action: '', show: 'admin'},
        { image: '~/assets/images/category.png', title: this.$t('categories'),
            component: this.$routes.Categories, action: '', show: 'admin'},
        { image: '~/assets/images/about.png', title: this.$t('about'), 
            component: this.$routes.About, action: '', show: 'admin'},
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
              appSettings.remove('apiKey')
              console.log('logged out')
              this.$navigateTo(this.$routes.Login, {clearHistory: true})
//            })
//            exit() // exit caused update of apiKey to be ignored
        }
        // use the manual navigation method
        this.$navigateTo(pageComponent, {props: { startTab: 1}}) // 0 not working for IOS?
        // and we probably want to close the drawer when changing pages
        this.closeDrawer()
    }
  }
}
</script>

<style lang="css">
</style>
