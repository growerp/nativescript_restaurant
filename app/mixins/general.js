
import * as app from 'tns-core-modules/application';
import myActionBar from '../components/actionBar'
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
const admob = require("nativescript-admob")

export default {
  name: 'general',
  components: {
    myActionBar
  },
  data () {
    return {
      true: true,
      false: false,
    }
  },
  methods: {
    onHeaderTapSetUp() {
      this.$navigateTo(this.$routes.SetUp)
    },
    onHeaderTapHome() {
      this.$navigateTo(this.$routes.Home)
    },
    note(text) {
      var toast = new Toasty({ 
          text: text,
          duration: ToastDuration.SHORT,
          position: isAndroid? ToastPosition.TOP : ToastPosition.BOTTOM,
          yAxisOffset: isAndroid? 100 : -90,
          xAxisOffset: 0,
      });
      toast.show();
    },
    hideKeyboard() {
      if (isAndroid) {
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
    createBanner(location) {
      admob.createBanner({
        testing: TNS_ENV === 'production'?  false : true,
        size: admob.AD_SIZE.SMART_BANNER, // anything in admob.AD_SIZE, like admob.AD_SIZE.SMART_BANNER
        iosBannerId: "ca-app-pub-3815355572205814/4606454149", // add your own
        androidBannerId: "ca-app-pub-3940256099942544/6300978111", // add your own this is test
        // Android automatically adds the connected device as test device with testing:true, iOS does not
        // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
        margins: { bottom: isIOS ? location : 0 },
        keywords: ["restaurant", "food", "drinks"] // add keywords for ad targeting
      }).then(
        function() { console.log("admob createBanner done location: " + location) },
        function(error) { console.log("admob createBanner error: " + error) }
      ) 
    },
    pageLoaded(location=50) {
      if (!this.isSubscribed('noAdds')) {
          setTimeout(() => {
            this.createBanner(location) }, 1)
      }
    }
  }
}
