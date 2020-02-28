
import * as app from 'tns-core-modules/application';
import myActionBar from '../components/actionBar'
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import { isIOS, isAndroid } from 'tns-core-modules/platform';

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
          backgroundColor: '#4baa9b',
          yAxisOffset: isAndroid? 0 : -40,
          xAxisOffset: 0,
          ios: {
            displayShadow: true,
            shadowColor: '#fff000',
            cornerRadius: 24
          },
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
  }
}
