
import * as app from 'tns-core-modules/application';
import { time } from 'tns-core-modules/profiling/profiling';
var admob = require("nativescript-admob")
const platformModule = require("tns-core-modules/platform");
import myActionBar from '../components/actionBar'

export default {
    name: 'general',
    components: {
      myActionBar
    },
    methods: {
      onHeaderTapSetUp() {
        this.$navigateTo(this.$routes.SetUp)
      },
      onHeaderTapHome() {
        this.$navigateTo(this.$routes.Home)
      },
      note(text) {
        var nstoasts = require("nativescript-toasts");
        var options = {
          text: text,
          duration : nstoasts.DURATION.LONG,
          position : nstoasts.POSITION.TOP //optional
        }
        nstoasts.show(options)
      },
      hideKeyboard() {
        if (platformModule.isAndroid) {
          try {
            let activity = app.android.foregroundActivity;
            let Context = app.android.context;
            let inputManager = Context.getSystemService(
                android.content.Context.INPUT_METHOD_SERVICE);
            if (activity.getCurrentFocus()) {
              inputManager.hideSoftInputFromWindow(activity.getCurrentFocus()
                .getWindowToken(),
                android.view.inputmethod.InputMethodManager.HIDE_NOT_ALWAYS);
            }
          } catch (err) {
            console.log('Keyboard hide error:' + err);
          }
        }
      },
      isSubscribed(func) {
        if (this.$store.getters.isSubActive(global.subscriptions.find(sub => sub.func === func).productIdentifyer)) {
          return true
        } else {
          return false
        }
      },
      subscribedUsers() {
        let users = 2 // free employees
        for (let i=0; i< global.subscriptions.length;i++) {
          if (global.subscriptions[i].func.startsWith('users') &&
              this.$store.getters.isSubActive(global.subscriptions[i].productIdentifyer)) {
            users += Number(global.subscriptions[i].func.substring(5,7))
          }
        }
        return users
      },
      hideBanner() {
        admob.hideBanner()
      },
      createBanner(location=50) {
        const platformModule = require("tns-core-modules/platform")
        admob.createBanner({
          testing: TNS_ENV === 'production'?  false : true,
          size: admob.AD_SIZE.SMART_BANNER, // anything in admob.AD_SIZE, like admob.AD_SIZE.SMART_BANNER
          iosBannerId: "ca-app-pub-3815355572205814/4606454149", // add your own
          androidBannerId: "ca-app-pub-3940256099942544/6300978111", // add your own this is test
          // Android automatically adds the connected device as test device with testing:true, iOS does not
          // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
          margins: { bottom: platformModule.isIOS ? location : 0 },
          keywords: ["restaurant", "food", "drinks"] // add keywords for ad targeting
        }).then(
          () => { console.log("admob createBanner done")},
          error => {
            console.log("admob createBanner error: " + error);
        })
      },
      pageLoaded(bottom) {
        if (!this.isSubscribed('noAdds')) {
          if (platformModule.isIOS) {
            setTimeout(() => {
              this.createBanner(bottom) }, 10)
          }
          if (platformModule.isAndroid) this.createBanner(bottom) // enable for android for now
        }
      }
  }
}
