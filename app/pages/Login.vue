<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <Image class="logo" src="~/assets/images/growerp.png"/>
                <!-- Label class="header"> {{ $t("login" )}} {{ $t("restaurant") }} </Label-->

                <GridLayout rows="auto, auto, auto, auto, auto" columns="*,*" width="100%">
                    <StackLayout row="0" col="0" colSpan="2"  v-show="isLoggingIn" class="input-field">
                        <TextField class="input" :hint="$t('usrNameEmail')" :isEnabled="!processing"
                            autocorrect="false"
                            autocapitalizationType="none" v-model="user.name"
                            returnKeyType="next" @returnPress="focusPassword"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="0" col="0" v-show="!isLoggingIn" class="input-field">
                        <TextField class="input" :hint="$t('restName')" :isEnabled="!processing"
                            autocorrect="false"
                            autocapitalizationType="none" v-model="company.name"
                            returnKeyType="next" @returnPress="focusPassword"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="0" col="1"  v-show="!isLoggingIn" class="input-field">
                        <DropDown :items="currencyUomIds" :hint="$t('currency')" :isEnabled="!processing" class="selectionCurrency"
                        @selectedIndexChanged="dropDownSelectedIndexChanged"/>
                    </StackLayout>

                    <StackLayout row="1" col="0" v-show="!isLoggingIn" class="input-field">
                        <TextField class="input" :hint="$t('firstName')" :isEnabled="!processing"
                            autocorrect="false"
                            autocapitalizationType="none" v-model="user.firstName"
                            returnKeyType="next"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="1" col="1" v-show="!isLoggingIn" class="input-field">
                        <TextField class="input" :hint="$t('lastName')" :isEnabled="!processing"
                            autocorrect="false"
                            autocapitalizationType="none" v-model="user.lastName"
                            returnKeyType="next"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="2" col="0" colSpan="2" v-show="!isLoggingIn" class="input-field">
                        <TextField class="input" :hint="$t('email')" :isEnabled="!processing"
                            keyboardType="email" autocorrect="false"
                            autocapitalizationType="none" v-model="user.email"
                            returnKeyType="next"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                   <StackLayout row="3" col="0" colSpan="2" class="input-field">
                        <TextField class="input" ref="password" :isEnabled="!processing"
                            :hint="$t('password')" secure="true" v-model="user.password"
                            :returnKeyType="isLoggingIn ? 'done' : 'next'"
                            @returnPress="focusConfirmPassword"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="4" col="0" colSpan="2" v-show="!isLoggingIn" class="input-field">
                        <TextField class="input" ref="confirmPassword" :isEnabled="!processing"
                            :hint="$t('confirmPassword')" secure="true" v-model="user.confirmPassword"
                            returnKeyType="done"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <ActivityIndicator col="0" colSpan="2" :busy="processing"/>
                </GridLayout>

                <Button :text="isLoggingIn ? $t('login') : $t('signUp') " :isEnabled="!processing"
                    @tap="submit" class="btn btn-primary btn-rounded-sm"></Button>
                <Label *v-show="isLoggingIn" :text="$t('forgotPassword')"
                    class="login-label" @tap="forgotPassword"></Label>
            </StackLayout>

            <Label class="login-label sign-up-label" @tap="toggleForm">
                <FormattedString>
                    <Span :text="isLoggingIn ? $t('notHaveAccount') : $t('backtoLogin') "></Span>
                    <Span :text="isLoggingIn ? $t('signUp') : ''" class="bold"></Span>
                </FormattedString>
            </Label>
        </FlexboxLayout>
    </Page>
</template>

<script>
  import general from '~/mixins/general'
  import { images } from '~/assets/imagesBase64'
  import PasswordUpdate from './modalPages/PasswordUpdate'
  import { ValueList } from "nativescript-drop-down";
  import { exit } from 'nativescript-exit';
    export default {
        name: 'Login',
        mixins: [ general ],
        data() {
            return {
                isLoggingIn: true,
                processing: false,
                apiKey: '',
                user: (TNS_ENV === 'production')? {
                    name: this.$store.getters.user.name,
                    email: this.$store.getters.user.email,
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    currency: '',
                    locale: ''
                } : {
                    name: this.$store.getters.user.name ? this.$store.getters.user.name : "admin@growerp.com",
                    email: "admin@growerp.com",
                    password: "qqqqqq9!",
                    confirmPassword: "qqqqqq9!",
                    firstName: 'Admin',
                    lastName: 'Owner',
                    locale: 'TH',
                    currency: 'THB'
                },
                locales: ['EN', 'TH', 'US', 'NL'],
                company: (TNS_ENV === 'production')? {
                    name: '',
                    currency: '',
                } : {
                    name: 'My litle Restaurant',
                    currency: 'THB',
                },
                currencyUomIds: null,
            };
        },
        created() {
          console.log('===login.vue: created starting')
          this.processing = true
          console.log ('===checking ==ping')
          this.$backendService.ping() // check if server present
          .then (result => {
            if (result.data && result.data.ok === 'ok') {
              console.log('=== ping is ok now getting token....')
              this.$backendService.getToken()
              .then (resultToken => {
                this.$store.commit('moquiToken', resultToken.data)
                this.$backendService.saveToken()
                console.log('=== moqui token is ok....')
                if (!this.$store.getters.user.name) {
                  console.log('===using for the first time so show register screen')
                  this.processing = false
                  this.toggleForm(); return}
                if (this.$store.getters.apiKey) { // skip login when have api_key
                  console.log('===got old apiKey: ' + this.$store.getters.apiKey)
                  this.$backendService.saveKey() // save it in the API
                  this.$backendService.checkApiKey() // check if apiKey still valid
                  .then (result => {
                    if (result.data.ok === 'ok') {
                      console.log('===checkApiKey is fine')
                      this.$backendService.getUser()
                      .then ( result => {
                          console.log('received user information')
                          this.$store.commit("user", result.data.user)
                          this.$backendService.getActiveSubscriptions()
                          .then( activeSubscriptions => {
                            console.log(' received active subscriptions') // not show adds at home screen
                            this.$store.commit("activeSubscriptions", activeSubscriptions.data.subscriptions)
                            this.$backendService.initData()
                            this.$navigateTo(this.$routes.Home, {clearHistory: true})
                          })
                      })
                    } else { // server key wrong so delete it and login again
                      this.$store.commit('apiKey', '') //clear old key
                      this.processing = false
                    }
                  })
                  .catch( error => {
                    console.log('====Api key invalid, catch error:' + JSON.stringify(error))
                    this.$store.commit('apiKey', '') //clear old key
                    this.$navigateTo(this.$routes.Login, {clearHistory: true})
                  })
                } else {
                  this.processing = false // no api key so show login screen
                }
              })
            } else {
              this.alert("====Unable to get a token from the GrowERP mobile server!")
              this.processing = false
              this.serverProblem()
            }
          })
          .catch( error => {
            this.processing = false
            console.log('=========ping server problem: ' + error.message)
            this.isLoggingIn = true
            this.serverProblem()
          })
        },
        methods: {
            toggleForm() {
                this.isLoggingIn = !this.isLoggingIn;
                if (!this.isLoggingIn){
                    this.$backendService.getCurrencyList().then (results => {
                        this.currencyUomIds = new ValueList(results.data.currencyList)
                    })
                }
            },
            dropDownSelectedIndexChanged(args) {
                this.company.currency = this.currencyUomIds.getValue(args.newIndex);
            },
            submit() {
                if ((!this.user.name && !this.user.email) || !this.user.password) {
                    this.note(this.$t('provideEmailPassword'))
                    return;
                }
                this.processing = true
                if (this.isLoggingIn) {
                    this.login();
                } else {
                    this.user.name = this.user.email //initially the same
                    this.register();
                }
            },

            login() {
                this.$backendService.login(this.user).then (result => {
                  console.log('===login status:' + result.status)
                  if (result.status == null) {
                      this.note(this.$t('connError'))
                  } else if (result.data.passwordChange) {
                    console.log('=== change password')
                    this.$showModal(PasswordUpdate,{props:
                          { oldPassword : this.user.password,
                            username: this.user.name,
                            fullName: this.user.firstName + ' ' +
                              this.user.lastName}})
                    .then (() => {
                        this.user.password = ''
                        this.processing = false})
                  } else if (result.data.apiKey) { // if apiKey present = logged in
                      console.log('===api key present')
                      this.$store.commit('apiKey', result.data.apiKey)
                      this.$backendService.saveKey()
                      this.$store.commit('moquiToken', result.data.moquiSessionToken)
                      this.$backendService.saveToken()
                      this.$store.commit('user',result.data.user)
                      this.$backendService.initData()
                      this.$backendService.getActiveSubscriptions()
                      .then( activeSubscriptions => { // need to check if adds are required present on home screen
                        this.$store.commit("activeSubscriptions", activeSubscriptions.data.subscriptions)
                        this.$navigateTo(this.$routes.Home, {clearHistory: true})})
                  } else {
                      this.note(this.$t('accountNotFound'))
                  }
                })
                .catch( error => {
                  this.processing = false
                  console.log("==login==error: " + JSON.stringify(error.response))
                  if (error.response.data.errorCode == 400) {
                    this.note(this.$t('passwordWrong'))
                    this.user.password = ''
                  } else this.note(this.$t('serverProblem') + ', ' + this.$t('retry'))
                  this.$navigateTo(this.$routes.Login, {clearHistory: true})
                })
            },

            forgotPassword() {
                prompt({
                    title: this.$t('forgotPassword'),
                    message: this.$t('enterEmail'),
                    inputType: "email",
                    defaultText: this.user.email,
                    okButtonText: "Ok",
                    cancelButtonText: this.$t('cancel')
                }).then (data => {
                  this.processing = true
                  if (data.text && data.result == true) {
                    this.$backendService.resetUserPassword(data.text.trim()).then (res => {
                        this.alert(res.data.messages);
                    })
                    .catch( error => {
                        this.note(this.$t('sendPasswordError') + this.$backendService.getErrorMessage(error))
                        thi.serverError()
                    })
                  } else {
                    if (data.result == true) {
                      this.note(this.$t('enterEmail'))
                    }
                  }
                  this.processing = false
                })
                this.processing = false
            },

            register() {
                console.log('-----company.name: ' + this.company.name)
                if (this.user.password !== this.user.confirmPassword) {
                  this.note(this.$t('passwordNotMatch'))
                  this.processing = false
                } else if (this.company.name === '') {
                  this.note(this.$t('enterRestaurantName'))
                  this.processing = false
                } else if (this.company.currency === '') {
                  this.note(this.$t('enterCurrency'))
                  this.processing = false
                } else {
                  this.$backendService.register(this.user, this.company).then(response => {
                    this.processing = false
                    this.alert(response.data.messages + 'You can login now.....')
                    const appSettings = require("tns-core-modules/application-settings")
                    appSettings.clear() // start fresh
                    this.$store.commit('username', this.user.name)
                    this.user.locale = global.locale
                    this.$backendService.getToken().then(resultToken => {
                      this.$store.commit('moquiToken', resultToken.data)
                      this.$backendService.saveToken()
                      this.$backendService.login(this.user).then (result => {
                        this.$store.commit('apiKey', result.data.apiKey)
                        this.$backendService.saveKey()
                        this.$store.commit('moquiToken', result.data.moquiSessionToken)
                        this.$backendService.saveToken()
                        this.loadDefaultData()
                        this.toggleForm()
                        if(TNS_ENV === 'production')
                          this.user.password = '' // force user to re-enter password only production
                      })
                    })
                  })
                  .catch( error => {
                    this.processing = false
                    if (error.response.data.errors.indexOf("Found issues with password") !== -1) {
                      this.alert(this.$t('passwordRequirement'))
                    } else {
                      this.serverError()
                    }
                  })
                }
            },

            focusPassword() {
                this.$refs.password.nativeView.focus();
            },
            focusConfirmPassword() {
                if (!this.isLoggingIn) {
                    this.$refs.confirmPassword.nativeView.focus();
                }
            },
            alert(message) {
            return alert({
              title: 'GrowERP ' + this.$t('message'),
              okButtonText: "OK",
              message: message
              });
            },

            serverProblem(message) {
                confirm({
                    title: this.$t('serverProblem'),
                    message: message ? message : this.$t('serverNotAvailable'),
                    okButtonText: this.$t('retry'),
                    cancelButtonText: this.$t('exit')
                }).then (data => {
                  if (data) this.$navigateTo(this.$routes.Login, {clearHistory: true})
                  else exit() 
              });
            },

            loadDefaultData() {
              if (TNS_ENV === 'production') {
                let item = {}
                item.description = this.$t('kitchen')
                this.$backendService.createPreparationArea(item).then( result => {
                  this.$backendService.uploadImage('small', images.kitchenImageSmall, 'prep', result.data.preparationAreaId)
                  this.$backendService.uploadImage('medium', images.kitchenImageMedium, 'prep', result.data.preparationAreaId)
                  item.categoryName = this.$t('food') ; item.preparationAreaId = result.data.preparationAreaId
                  this.$backendService.createCategory(item).then( result => {
                    this.$backendService.uploadImage('small', images.foodImageSmall, 'category', result.data.productCategoryId)
                    this.$backendService.uploadImage('medium', images.foodImageMedium, 'category', result.data.productCategoryId)
                    this.$backendService.createProduct('macaroni', '6.20', result.data.productCategoryId).then( result => {
                      this.$backendService.uploadImage('small', images.macaroniImageSmall, 'product', result.data.productId)
                      this.$backendService.uploadImage('medium', images.macaroniImageMedium, 'product', result.data.productId)
                })})})
                item.description = this.$t('bar')
                this.$backendService.createPreparationArea(item).then( result => {
                  this.$backendService.uploadImage('small', images.barImageSmall, 'prep', result.data.preparationAreaId)
                  this.$backendService.uploadImage('medium', images.barImageMedium, 'prep', result.data.preparationAreaId)
                  item = { categoryName: this.$t('drinks'), preparationAreaId: result.data.preparationAreaId }
                  this.$backendService.createCategory(item).then( result => {
                    this.$backendService.uploadImage('small', images.drinksImageSmall, 'category', result.data.productCategoryId)
                    this.$backendService.uploadImage('medium', images.drinksImageMedium, 'category', result.data.productCategoryId)
                    this.$backendService.createProduct(this.$t('cola'), '80', result.data.productCategoryId).then( result => {
                      this.$backendService.uploadImage('small', images.colaImageSmall, 'product', result.data.productId)
                      this.$backendService.uploadImage('medium', images.colaImageMedium, 'product', result.data.productId)
                })})})
                // accomodation area and spot(table)
                let area = { description: this.$t('inside'), nbrOfSpots: '10'}
                this.$backendService.createAccommodationArea(area).then( result => {
                  this.$backendService.uploadImage('small', images.insideImageSmall, 'area', result.data.accommodationAreaId)
                  this.$backendService.uploadImage('medium', images.insideImageMedium, 'area', result.data.accommodationAreaId)})
                area = {description: this.$t('garden'), nbrOfSpots: '15'}
                this.$backendService.createAccommodationArea(area).then( result => {
                  this.$backendService.uploadImage('small', images.outsideImageSmall, 'area', result.data.accommodationAreaId)
                  this.$backendService.uploadImage('medium', images.outsideImageMedium, 'area', result.data.accommodationAreaId)})
              } else {
              let item = {}
              item.description = "Kitchen"
              this.$backendService.createPreparationArea(item).then( result => {
                this.$backendService.uploadImage('small', images.kitchenImageSmall, 'prep', result.data.preparationAreaId)
                this.$backendService.uploadImage('medium', images.kitchenImageMedium, 'prep', result.data.preparationAreaId)
                item.categoryName = 'Food' ; item.preparationAreaId = result.data.preparationAreaId
                this.$backendService.createCategory(item).then( result => {
                  this.$backendService.uploadImage('small', images.foodImageSmall, 'category', result.data.productCategoryId)
                  this.$backendService.uploadImage('medium', images.foodImageMedium, 'category', result.data.productCategoryId)
                  this.$backendService.createProduct('macaroni', '6.20', result.data.productCategoryId).then( result => {
                    this.$backendService.uploadImage('small', images.macaroniImageSmall, 'product', result.data.productId)
                    this.$backendService.uploadImage('medium', images.macaroniImageMedium, 'product', result.data.productId)})
                  this.$backendService.createProduct('french fries', '2.99', result.data.productCategoryId)
                  this.$backendService.createProduct('Tomjamkuhn', '3.99', result.data.productCategoryId)
                  this.$backendService.createProduct('Cheese plate', '4.99', result.data.productCategoryId)})
              })
              item.description = "Bar"
              this.$backendService.createPreparationArea(item).then( result => {
                this.$backendService.uploadImage('small', images.barImageSmall, 'prep', result.data.preparationAreaId)
                this.$backendService.uploadImage('medium', images.barImageMedium, 'prep', result.data.preparationAreaId)
                item.categoryName = 'Sodas' ; item.preparationAreaId = result.data.preparationAreaId
                this.$backendService.createCategory(item).then( result => {
                  this.$backendService.uploadImage('small', images.drinksImageSmall, 'category', result.data.productCategoryId)
                  this.$backendService.uploadImage('medium', images.drinksImageMedium, 'category', result.data.productCategoryId)
                  this.$backendService.createProduct('cola', '5.99', result.data.productCategoryId).then( result => {
                    this.$backendService.uploadImage('small', images.colaImageSmall, 'product', result.data.productId)
                    this.$backendService.uploadImage('medium', images.colaImageMedium, 'product', result.data.productId)})
                  this.$backendService.createProduct('fanta', '6.99', result.data.productCategoryId)
                  this.$backendService.createProduct('Pepsi', '7.99', result.data.productCategoryId)
                  this.$backendService.createProduct('Smoothy', '8.99', result.data.productCategoryId)})
                  item.categoryName = 'Beers and Liquor'
                  this.$backendService.createCategory(item).then( result => {
                    this.$backendService.createProduct('Best Beer', '11.99', result.data.productCategoryId)
                    this.$backendService.createProduct('Wiskey', '21.99', result.data.productCategoryId)
                    this.$backendService.createProduct('Red Wine', '31.99', result.data.productCategoryId)
                    this.$backendService.createProduct('White wine', '41.99', result.data.productCategoryId)})
              })
              let area = { description: 'Inside', nbrOfSpots: '10'}
              this.$backendService.createAccommodationArea(area).then( result => {
                this.$backendService.uploadImage('small', images.insideImageSmall, 'area', result.data.accommodationAreaId)
                this.$backendService.uploadImage('medium', images.insideImageMedium, 'area', result.data.accommodationAreaId)})
              area = { description: 'Outside', nbrOfSpots: '15'}
              this.$backendService.createAccommodationArea(area).then( result => {
                this.$backendService.uploadImage('small', images.outsideImageSmall, 'area', result.data.accommodationAreaId)
                this.$backendService.uploadImage('medium', images.outsideImageMedium, 'area', result.data.accommodationAreaId)})

              // add users and todo tasks only test
              let user1 = {firstName: 'Peter', lastName: 'Coster',
                  email: 'test3@hansbakker.com',roleTypeId: 'Employee', groupDescription: 'Employee'}
              this.$backendService.createUser(user1).then( result => {
                let item = { workEffortName:'This a first task',
                          partyId: result.data.user.partyId,priority: '5'}
                this.$backendService.createTask(item)})

              let user2 = {firstName: 'Kevin', lastName: 'Junker',
                  email: 'test4@hansbakker.com',roleTypeId: 'Employee', groupDescription: 'Employee'}
              this.$backendService.createUser(user2).then( result => {
                let item2 = { workEffortName:'This a second task',
                          partyId: result.data.user.partyId , priority: '5'}
                this.$backendService.createTask(item2)})

              let item3 = { workEffortName:'This a third task for me', priority: '5'}
              this.$backendService.createTask(item3)
              item3 = { workEffortName:'This a fourth task to me'}
              this.$backendService.createTask(item3)
              // customer
              user2 = {firstName: 'Steven', lastName: 'Customer',
                  email: 'test5@hansbakker.com',roleTypeId: 'Customer',
                  image: '~/assets/images/addImage.png', externalId: '99999'}
              this.$backendService.createUser(user2)
            }
          }
        }
    }
</script>

<style scoped>
    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 15;
        margin-right: 15;
        flex-grow: 2;
        vertical-align: middle;
    }

    .logo {
        margin-bottom: 12;
        height: 90;
        font-weight: bold;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #D51A1A;
    }

    .input-field {
        margin-bottom: 15;
    }

    .input {
        font-size: 16;
        placeholder-color: #A8A8A8;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
        background-color: #33cd5f;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .sign-up-label {
        margin-bottom: 20;
    }

    .bold {
        color: #000000;
    }
    .selectionCurrency {
        font-size: 16;
        color: black;
        text-align: center;
    }
</style>
