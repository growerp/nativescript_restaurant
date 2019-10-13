<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <StackLayout class="form">
        <Image class="logo" src="~/assets/images/growerp.png"/>
        <!-- Label class="header"> {{ $t("login" )}} {{ $t("restaurant") }} </Label-->

        <GridLayout rows="auto, auto, auto, auto, auto" columns="*,*" width="100%">
          <StackLayout row="0" col="0" colSpan="2"  v-show="isLoggingIn" class="input-field">
            <TextField class="input" :hint="$t('usrNameEmail')" :isEnabled="!processing"
                autocorrect="false" ref="username" 
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
            <StackLayout class="hr-light"/>
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
                autocapitalizationType="none" v-model="user.emailAddress"
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
import Confirm from './modalPages/Confirm'
import Alert from './modalPages/Alert'
import PasswordUpdate from './modalPages/PasswordUpdate'
import { ValueList } from "nativescript-drop-down";
import { exit } from 'nativescript-exit';
const appSettings = require("tns-core-modules/application-settings")
  export default {
    name: 'Login',
    mixins: [ general ],
    data() {
      return {
        isLoggingIn: true,
        processing: false,
        apiKey: '',
        user: (TNS_ENV === 'production')? {
          name: appSettings.getString('username'),
          emailAddress: appSettings.getString('username'),
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
        currencyUomIds: null,
      };
    },
    created() {
      this.processing = true
      console.log("===created get connection")
      this.$store.dispatch('getConnection').then( result => {
        this.processing = false
        console.log("result from getConnection: " + result)
        if (result == 'noPing') {
          this.serverProblem() }
        if (result == 'register') {
          this.user.name = this.user.emailAddress //initially the same
          this.isLoggingIn = false
          this.register()}
        if (result == 'noApiKey') {
          this.isLoggingIn = true }
        if (result == 'success') {
          this.$store.dispatch('initData')
          console.log("==init ===created====going home======")
          this.$navigateTo(this.$routes.Home, 
            {clearHistory: true, props: {firstTime: true}})
        }
      })
    },
    methods: {
      toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
        if (!this.isLoggingIn){
          this.$backendService.getCurrencyList().then (results => {
              this.currencyUomIds = 
                  new ValueList(results.data.currencyList)
          })
        }
      },
      dropDownSelectedIndexChanged(args) {
          this.company.currency = this.currencyUomIds.getValue(args.newIndex);
      },
      submit() {
        if ((!this.user.name && !this.user.emailAddress) || !this.user.password) {
            this.note(this.$t('provideEmailPassword'))
            return;
        }
        this.processing = true
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.user.name = this.user.emailAddress //initially the same
            this.register();
        }
      },
      login() {
        console.log("=====logging in ======")
        this.$store.dispatch('getConnection').then( result => {
          this.$store.dispatch("login", this.user).then(result => {
            console.log(" login result: " + result)
            if (result == 'success') {
              console.log("====success, loading initial data")
              this.$store.dispatch('initData').then(() => { 
                console.log("====done going home.....")
                this.$navigateTo(this.$routes.Home, 
                    {clearHistory: true, props: { firstTime: true }})
              })
            }
            if (result == 'passwordChange') {
              this.$showModal(PasswordUpdate,{props:
                { oldPassword : this.user.password,
                  username: this.user.name,
                  fullName: this.user.firstName + ' ' +
                    this.user.lastName}})
              .then (() => {
                this.user.password = ''
                this.processing = false})
            }
          })
        })
      },

      forgotPassword() {
        prompt({
          title: this.$t('forgotPassword'),
          message: this.$t('enterEmail'),
          inputType: "email",
          defaultText: appSettings.getString('username'),
          okButtonText: "Ok",
          cancelButtonText: this.$t('cancel')
        }).then (data => {
          this.processing = true
          if (data.text && data.result == true) {
            this.$store.dispatch('getConnection').then( result => {
              this.$backendService.resetUserPassword(data.text.trim())
              .then (res => {
                  this.alert(res.data.messages);
              })
              .catch( error => {
                  this.note(this.$t('sendPasswordError') + 
                    this.$backendService.getErrorMessage(error))
              })
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
        this.$store.dispatch('getConnection').then( result => {
          if (result == 'noPing') {
            this.serverProblem() }
          else {
            console.log('--register!---company.name: ' + this.company.name)
            this.processing = false
            if (this.user.password !== this.user.confirmPassword) {
              this.note(this.$t('passwordNotMatch'))
            } else if (this.company.name === '') {
              this.note(this.$t('enterRestaurantName'))
            } else if (this.company.currency === '') {
              this.note(this.$t('enterCurrency'))
            } else {
              this.$store.dispatch('register', 
                  {company: this.company, user: this.user})
              .then( regResult => {
                console.log("====register result: " + regResult)
                if (regResult == 'passwordRequirement')
                  this.note(this.$t(regResult))
                else if (regResult.startsWith('regError')) {
                  this.note(this.$t(regError) + regResult.substring(8))
                } else {
                  this.processing = true
                  console.log("====== register success! logging in")
                  this.$store.dispatch('login',this.user)
                  .then (() => {
                    console.log("=======after register logged in")
                    this.$store.dispatch('loadDefaultData', [
                        this.$t('kitchen'),this.$t('food'),this.$t('macaroni'),
                        this.$t('bar'),this.$t('drinks'),this.$t('inside'),
                        this.$t('garden'),this.$t('drinks'),this.$t('cola')])
                    .then(() => {
                      console.log("===== default data loaded ")
                      this.processing = false
                      this.$showModal(Alert,{ props: {
                        message: 'You can login now.....'}})
                      .then(() => {
                        if (TNS_ENV === 'production') delete this.user.password 
                        this.isLoggingIn = true
                      })
                    })
                  })
                }
              })
            }
          }
        }) 
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
        this.$showModal(Alert,{ props: {
              message: message}
        })
      },

      serverProblem(message=this.$t('connError')) {
        this.$showModal(Confirm,{ props: {
            message: this.$t('serverNotAvailable'),
            ok: 'retry',
            cancel: 'exit' }
        })
        .then (data => {
            if (data) this.$navigateTo(this.$routes.Login, {clearHistory: true})
            else exit() 
        });
      },
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
