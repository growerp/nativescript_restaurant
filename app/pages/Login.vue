<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <StackLayout class="form">
        <Image class="logo" src="~/assets/images/growerp.png"/>
        <Label class="header"> {{ $t("login" )}} {{ $t("restaurant") }} </Label>

        <GridLayout rows="auto, auto, auto, auto, auto" columns="*,*" width="100%">
          <StackLayout row="0" col="0" colSpan="2"  v-show="isLoggingIn" class="input-field">
            <TextField class="input" :hint="$t('usrNameEmail')" :isEnabled="!processing"
                autocorrect="false" ref="username" 
                autocapitalizationType="none" v-model="user.name"
                returnKeyType="next" ></TextField>
          </StackLayout>

          <StackLayout row="0" col="0" v-show="!isLoggingIn" class="input-field">
            <TextField class="input" :hint="$t('restName')" :isEnabled="!processing"
                autocorrect="false"
                autocapitalizationType="none" v-model="company.name"
                returnKeyType="next" ></TextField>
          </StackLayout>

          <StackLayout row="0" col="1"  v-show="!isLoggingIn" class="input-field" height="30">
            <DropDown :items="currencyUomIds" :hint="$t('currency')" 
              :isEnabled="!processing" class="selectionCurrency"
              @selectedIndexChanged="dropDownSelectedIndexChanged"/>
          </StackLayout>

          <StackLayout row="1" col="0" v-show="!isLoggingIn" class="input-field">
            <TextField class="input" :hint="$t('firstName')" :isEnabled="!processing"
                  autocorrect="false"
                  autocapitalizationType="none" v-model="user.firstName"
                  returnKeyType="next"></TextField>
          </StackLayout>

          <StackLayout row="1" col="1" v-show="!isLoggingIn" class="input-field">
            <TextField class="input" :hint="$t('lastName')" :isEnabled="!processing"
                autocorrect="false"
                autocapitalizationType="none" v-model="user.lastName"
                returnKeyType="next"></TextField>
          </StackLayout>

          <StackLayout row="2" col="0" colSpan="2" v-show="!isLoggingIn" class="input-field">
            <Label :text="$t('passwordByEmail')" class="warning"/>
            <TextField class="input" :hint="$t('email')" :isEnabled="!processing"
                keyboardType="email" autocorrect="false"
                autocapitalizationType="none" v-model="user.emailAddress"
                returnKeyType="isLoggingIn ? 'next' : 'done'"></TextField>
          </StackLayout>

          <StackLayout row="3" col="0" colSpan="2" class="input-field" v-show="isLoggingIn"> 
            <TextField class="input" ref="password" :isEnabled="!processing"
                :hint="$t('password')" secure="true" v-model="user.password"
                :returnKeyType="done"></TextField>
          </StackLayout>

          <ActivityIndicator col="0" colSpan="2" :busy="processing" color="#00CAAB"
            width="100" height="100"/>
        </GridLayout>

        <Button :text="isLoggingIn ? $t('login') : $t('signUp') " :isEnabled="!processing"
            @tap="submit" class="btn btn-primary btn-rounded-sm" ref="submit"></Button>
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
var log = true
if (TNS_ENV === 'production') log = false
import general from '~/mixins/general'
import Confirm from './modalPages/Confirm'
import Alert from './modalPages/Alert'
import Prompt from './modalPages/Prompt'
import PasswordUpdate from './modalPages/PasswordUpdate'
import { ValueList } from "nativescript-drop-down";
import { exit } from 'nativescript-exit';
const appSettings = require("tns-core-modules/application-settings")
export default {
  name: 'Login',
  mixins: [ general ],
  data() {
    return {
      isLoggingIn: true, // login screen, false is register
      processing: false,
      apiKey: '',
      user: (TNS_ENV === 'production')? {
        name: appSettings.getString('username'),
        emailAddress: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        currency: '',
        locale: ''
      } : {
        name: appSettings.getString('username') ?
                appSettings.getString('username') : "admin@growerp.com",
        emailAddress: "admin@growerp.com",
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
      currencyUomIds: null
    };
  },
  created() {
    this.processing = true
    log?console.log("===created get connection==="):''
    if (!appSettings.hasKey('username')) {
        this.processing = false
        log? console.log('=== getConnection: first usage, so show register screen'):''
        this.toggleForm()   // started with login, switch to register
    } else this.$store.dispatch('getConnection').then( result => {
      log?console.log("==== result from created getConnection: " + result):''
      if (result == 'success') {
        this.$store.dispatch('initialData').then(() => {
          console.log("=====created accom areas: " + this.$store.getters.accommodationAreas[0].description)
          log?console.log("==init ===created====going home======"):''
          this.$navigateTo(this.$routes.Home, {clearHistory: true })
        })
      } else {
        this.processing = false
        if (result == 'serverProblem')
          this.serverProblem()
        if (result.startsWith('message:'))
          this.note(result.substring(8)) 
        else if (result == 'noApiKey')
          ()=>{} // no-op: just show login screen
        else console.log("==== unexpected return from getConnection dispatch! result: " + result)}
    })
  },
  methods: {
    toggleForm() {
      this.processing = false
      this.isLoggingIn = !this.isLoggingIn;
      if (!this.isLoggingIn && !this.currencyUomIds){
        console.log("====pinginh now====")
        this.$backendService.ping()
        .catch( error => {
          console.log("initial ping problem....")
          this.serverProblem()
        })
        .then(result => { // check if server present
          if (result.data && result.data.ok === 'ok') {
            this.$backendService.getCurrencyList().then(result => {
              this.currencyUomIds = new ValueList(result.data.currencyList)})
          } else this.serverProblem()
        })
      }
    },
    dropDownSelectedIndexChanged(args) {
        this.company.currency = this.currencyUomIds.getValue(args.newIndex);
    },
    submit() {
      this.processing = true
      if (this.isLoggingIn) {
        if ((!this.user.name && !this.user.emailAddress) || !this.user.password) {
          this.note(this.$t('provideEmailPassword'))
          this.processing = false
          return;
        }
        this.login();
      } else {
          this.user.name = this.user.emailAddress //initially the same
          this.register();
      }
    },
    login() {
      log?console.log("=====logging in ======"):''
      this.$store.dispatch('getConnection').then( result => {
        log?console.log("==== result from login getConnection: " + result):''
        if (result == 'noApiKey') {
          this.$store.dispatch("login", this.user).then(result => {
            log?console.log("==== login page login result: " + result):''
            if (result == 'success') {
              log?console.log("====login page success, loading initial data"):''
              this.$store.dispatch('initialData').then(() => { 
                console.log("========init done, accom area: " + 
                    this.$store.getters.accommodationAreas[0].description)
                log?console.log("====going home....."):''
                this.$navigateTo(this.$routes.Home, {clearHistory: true })
              })
            } else {
              this.processing = false
              if (result.startsWith('message:'))
                  this.note(result.substring(8))
              else if (result == 'loginFailed')
                console.log("==== login failed")
              else if (result == 'serverProblem')
                this.serverProblem()
              else if (result == 'passwordChange') {
                this.$showModal(PasswordUpdate,{props:
                  { oldPassword : this.user.password,
                    username: this.user.name,
                    fullName: this.user.firstName + ' ' +
                      this.user.lastName}})
                .then (() => {
                  this.user.password = '' })}
            }
          })
        } else if (result == 'success') { // after register
          this.$store.dispatch('initialData').then(() => {
            log?console.log("====apiKey found in login, init done, going home....."):''
            this.$navigateTo(this.$routes.Home, 
                {clearHistory: true, props: { firstTime: true }})
          })
        }
      })
    },

    forgotPassword() {
      this.$store.dispatch('getConnection').then( result => {
        if (result == 'serverProblem') {
          this.serverProblem() }
        else {
          this.$showModal(Prompt,{ props:{
            title: this.$t('forgotPassword'),
            message: this.$t('enterEmail'),
            defaultText: this.user.emailAddress ,
            inputType: 'email',}
          }).then (data => {
            if (data) {
              this.processing = true
              this.$backendService.resetUserPassword(data.toLowerCase().trim())
              .then (res => {
                this.processing = false
                this.$showModal(Alert,{ props: {
                    message: res.data.messages}
                })
              })
              .catch( error => {
                  this.note(this.$t('sendPasswordError') +
                    this.$backendService.getErrorMessage(error))
              })
            }
          })
        }
      })
    },

    register() {
      this.$store.dispatch('getConnection').then( result => {
        if (result == 'serverProblem') {
          this.serverProblem() }
        else {
          this.processing = false
          if (this.company.name === '') {
            this.note(this.$t('enterRestaurantName'))
          } else if (this.company.currency === '') {
            this.note(this.$t('enterCurrency'))
          } else if (this.user.firstName === '') {
            this.note(this.$t('enterFirstName'))
          } else if (this.user.lastName === '') {
            this.note(this.$t('enterLastName'))
          } else if (this.user.emailAddress === '') {
            this.note(this.$t('enterEmail'))
          } else {
            this.processing = true
            this.$store.dispatch('register', 
                {company: this.company, user: this.user, env: TNS_ENV, data: [
                      this.$t('kitchen'),this.$t('food'),this.$t('macaroni'),
                      this.$t('bar'),this.$t('inside'),this.$t('garden'),
                      this.$t('drinks'),this.$t('cola'),this.$t('bill')]})
            .then( regResult => {
              console.log("====register result: " + regResult)
              if (regResult == 'success') {
                console.log("====== register success! logging in")
                    this.processing = false
                    this.$showModal(Alert,{ props: {
                      message: 'You can login now.....'}})
                    .then(() => {
                      // force the user to enter password again.....
                      if (TNS_ENV === 'production') delete this.user.password 
                      this.isLoggingIn = true
                    })
              } else { // something wrong....
                this.processing = false
                if (regResult.startsWith("message:Found issues with password"))
                  this.$showModal(Confirm,{ props: {
                    message: this.$t('passwordRequirement1') }})
                else if (regResult.startsWith('message:'))
                  this.$showModal(Confirm,{ props: {
                    message: regResult.substring(8)}})
              }
            })
          }
        }
      }) 
    },
    serverProblem(message=this.$t('serverNotAvailable')) {
      console.log("====yes server problem!====")
      this.$showModal(Confirm,{ props: {
          message: message,
          ok: 'retry',
          cancel: 'exit' }
      })
      .then (data => {
        backendService.getToken().then (data => {
          backendService.saveToken(data)  
          if (data) this.$navigateTo(this.$routes.Login, {clearHistory: true})
          else exit() 
        })
      })
    }
  },
      
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
        text-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #D51A1A;
    }

    .input-field {
        margin-bottom: 15;
        color: #A8A8A8;
    }

    .input {
        font-size: 16;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
        background-color: #00CAAB;
    }

    .login-label {
        text-align: center;
        color: rgb(19, 16, 16);
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
    .warning {
        font-size: 16;
        color:#D51A1A;
        margin-left: 15;
        height: 25;
    }
</style>
