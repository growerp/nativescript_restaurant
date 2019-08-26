<template>
    <Page>
      <ActionBar>
        <GridLayout width="100%" columns="auto, *, auto">
          <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
          <StackLayout orientation="horizontal" @tap="$navigateTo($routes.SetUp)" col="1"
              horizontalAlignment="center">
            <Image src="~/assets/images/go-back-arrow.png" height="15"/>
            <Label class="title" :text="$t('upgrade')"/>
          </StackLayout>
        </GridLayout>
      </ActionBar>
      <StackLayout paddingTop="5">
        <Label class="h2" :text="$t('monthlySubscriptions')" horizontalAlignment="center"/>
        <Label class="h3" :text="$t('freeTrial')" horizontalAlignment="center" :visibility="android?'visible':'collapse'"/>
        <Label class="h3" :text="$t('chargedNotCancel')" horizontalAlignment="center" :visibility="android?'visible':'collapse'"/>
        <Label class="h3" :text="$t('emailDetails')" horizontalAlignment="center" :visibility="android?'visible':'collapse'"/>
        <RadListView ref="listView" for="item in itemList" @itemTap="onItemTap"
             @loaded="onLoaded" :height="ios?'35%':'60%'">
            <v-template>
              <GridLayout columns="50, *, auto" rows="auto,auto,auto" class="item" padding="10,20,10,20">
                  <Label :text="item.localizedTitle" class="h3" row="0" col="0" 
                    paddingLeft="30" colSpan="2"/>
                  <Image src="~/assets/images/U.png"  row="1" col="0" class="thumbnail" rowSpan="2"
                    :visibility="item.subscribed?'hidden':'visible'"/>
                  <Image src="~/assets/images/S.png"  row="1" col="0" class="thumbnail" rowSpan="2"
                    :visibility="item.subscribed?'visible':'hidden'"/>
                  <Label :text="item.priceFormatted + '/' + $t('month')" row="0" col="2" class="h3" verticalAlignment="center"/>
                  <Label :text="item.localizedDescription" class="p" textWrap="true" row="1" col="1" 
                    paddingLeft="10" rowSpan="2" colSpan="1"/>
              </GridLayout>
            </v-template>
        </RadListView>
        <Label class="h5" :text="$t('upgradeDetailIos')" horizontalAlignment="center" 
          textWrap="true" :visibility="ios?'visible':'collapse'" padding="30"/>
        <Button class="button" :text="$t('upgradeMoreDetail')" horizontalAlignment="center"
          textWrap="true" @tap="$navigateTo($routes.About)"  padding="15"/>
      </StackLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import general from '~/mixins/general'
var purchase = require("nativescript-purchase");
var transaction = require("nativescript-purchase/transaction");
var purchase = require("nativescript-purchase");

export default {
    name: 'Upgrade',
    mixins: [ sideDrawer, general],
    data() {
        return {
          itemList: process.env.NODE_ENV === 'production'? [] :
            [{productIdentifier: '10000',
              subscribed: false,
              localizedTitle: 'No advertisements',
              localizedDescription: 'Remove advertisements from all pages',
              priceFormatted: "100"},
             {productIdentifier: '10001',
              subscribed: true,
              localizedTitle: 'Add 3 more employees',
              localizedDescription: 'Be able to add 3 more employees logins',
              priceFormatted: "100"},
             {productIdentifier: '10003',
              subscribed: true,
              localizedTitle: 'Add 10 more employees',
              localizedDescription: 'Be able to add 10 more employees logins',
              priceFormatted: "100"},
              ],
          selectedIndex: -1,
          ios: false,
          android: false
        }
    },
    created() {
      const platformModule = require("tns-core-modules/platform");
      if (platformModule.isAndroid) this.android = true
      if (platformModule.isIOS) this.ios = true
      purchase.on(purchase.transactionUpdatedEvent, transaction => {
            console.log('=======updated event: ' + JSON.stringify(transaction))
            if (transaction.transactionState === 'purchased') {
                if (this.android) {
                  purchase.consumePurchase(transaction.transactionReceipt)
                  .then(responseCode => {
                    console.log('consume response code: (0=ok) ' + responseCode)
                  }) // If responseCode === 0 the purchase has been successfully consumed
                  .catch( error => { console.log('Purchase catch: ' + error)
                  })
                }
                this.note('Just bought' + this.itemList[this.selectedIndex].localizedTitle);
                console.log('Just bought' + transaction.productIdentifier);
                console.log('Transaction date: ' + transaction.transactionDate);
                console.log('Transaction identifier: ' + transaction.transactionIdentifier);
                this.$backendService.createSubscription(
                    transaction.productIdentifier,
                    this.itemList[this.selectedIndex].localizedTitle).then(() => {
                      this.$backendService.getActiveSubscriptions().then( result => {
                        store.commit("activeSubscriptions", result.data.subscriptions)
                        this.onLoaded()
                      })
                    })
            }
            else if (transaction.transactionState === 'restored') {
                console.log('Purchase of ' + transaction.originalTransaction.productIdentifier + ' restored.');
                console.log('original transaction:' + transaction.originalTransaction);
                console.log('Transactiondate: ' + transaction.originalTransaction.transactionDate);
            }
            else if (transaction.transactionState === 'failed') {
                console.log('Purchase of ' + transaction.productIdentifier + ' failed!');
            }
            else if (transaction.transactionState === 'purchasing') {
              console.log('Now purchasing: ' + transaction.productIdentifier);
              if (global.exceptionErrorMessage) {
                console.log('===exception error: ' + global.exceptionErrorMessage)
                global.exceptionErrorMessage = null
              }
            }
      });
    },
    methods: {
        onLoaded() {
          global.initPurchase.then(() => {
            purchase.getProducts()
            .then( result => {
              this.itemList = result
              if (this.android) {
                this.itemList.sort(function (a, b) { // sort by number
                  return a.localizedTitle.substring(0,1).
                  localeCompare(b.localizedTitle.substring(0,1))})
                for (let i=0;i<this.itemList.length;i++) { //remove number and product name
                  let t = this.itemList[i].localizedTitle
                  if (t.indexOf("(") != -1)
                    this.itemList[i].localizedTitle = t.substring(2,t.indexOf("("))
                  if (this.$store.getters.isSubActive(this.itemList[i].productIdentifier)) {
                      this.itemList[i].subscribed = true
                  } else {
                      this.itemList[i].subscribed = false
                  }
                }
              }
              if (this.ios) {
                for (let i=0;i<this.itemList.length;i++) {
                  console.log('processing: ' + i)
                  if (this.$store.getters.isSubActive(this.itemList[i].productIdentifier)) {
                      this.itemList[i].subscribed = true
                  } else {
                      this.itemList[i].subscribed = false
                  }
                }
              }
            }).catch(function(e) {
              console.log("get products error: " + e)
            })
          })
        },
        onItemTap(args) {
          this.selectedIndex = args.index
          if (purchase.canMakePayments()) {
            if (!this.itemList[args.index].subscribed) {
              purchase.buyProduct(this.itemList[args.index])
            } else {
              this.note(this.$t('alreadySubscribed'))
            }
          } else {
            this.note(this.$t('accountCannotPay'));
          }
        },
    }
}

</script>

<style>
</style>
