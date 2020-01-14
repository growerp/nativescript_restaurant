import ImageSource from "tns-core-modules/image-source"
const platformModule = require("tns-core-modules/platform");
const permissions = require("nativescript-permissions");
const camera = require("nativescript-camera");
const imagepicker = require("nativescript-imagepicker");
const fileSystemModule = require("tns-core-modules/file-system")
const imageSourceModule = require("tns-core-modules/image-source")
const BitmapFactory = require("nativescript-bitmap-factory")

export default {
    name: 'imageSelector',
    data () {
      return {
        itemImage: '',
      }
    },
    methods: {
      takePicture(type, id) {
        camera.requestPermissions()
        .then(() => {
          camera.takePicture({ width: 300, height: 300, keepAspectRatio: true,
            saveToGallery:false })
          .then(imageAsset => {
            this.scaleUploadImage(type, id, imageAsset)
          })
          .catch(e => {
            console.log('error:', e)
          })
        })
        .catch(e => {
          console.log('Error requesting permission');
        });
      },
      selectPicture(type,id) {
        let context = imagepicker.create({mode: 'single'})
        if (platformModule.device.os === "Android" && 
                platformModule.device.sdkVersion >= 23) {
          permissions.requestPermission([
              android.Manifest.permission.READ_EXTERNAL_STORAGE,
              android.Manifest.permission.WRITE_EXTERNAL_STORAGE],
              "I need these permissions to read/write scaled copies in the gallery")
          .then(() => { console.log ("permission ok") })
          .catch(error => {
            console.log("Permission problem: " + error)
          })
        }
        context
        .authorize()
        .then(function() {return context.present()})
        .then((selection) => {
          console.log("Selection done: " + JSON.stringify(selection))
          this.scaleUploadImage(type, id, selection[0])
        })
        .catch(e => {
          console.log('====error picture selection:' + e)
        })
      },
      scaleUploadImage(type,id, selected_item) {
        console.log("==!=selected item: " + JSON.stringify(selected_item))
        const source = new imageSourceModule.ImageSource();
        source.fromAsset(selected_item)
        .then((imageSource) => {
          const folder = fileSystemModule.knownFolders.documents().path;
          const fileName = "growerp" + Math.floor(Math.random() * 1000) + ".png";
          const path = fileSystemModule.path.join(folder, fileName);
          const saved = imageSource.saveToFile(path, "png")
          if (saved) {
            this.itemImage = path // show onscreen
            if (this.list) this.list[this.index].image = path // and on list if exist
            // create bitmap to be resized
            const image = imageSourceModule.fromFile(path)
            var bmp = BitmapFactory.create(image.height, image.width)
            // resize
            let base64Small = ''
            let base64Medium = ''
            bmp.dispose(function (b) {
                b.insert(BitmapFactory.makeMutable(image));
                var b2 = b.resizeMax(100);
                var thumb_image = b2.toImageSource();
                base64Small = thumb_image.toBase64String("png")
                var b3 = b.resizeMax(500);
                var medium_image = b3.toImageSource();
                base64Medium = medium_image.toBase64String("png")})
                // console.log("===small===" + base64Small + "<<")
                // console.log("===medium===" + base64Medium + "<<")
            this.$backendService.uploadImage('small', 
                base64Small, type, id)
            this.$backendService.uploadImage('medium',
                base64Medium, type, id)
            this.$store.commit('image', { type: type, id: id,
                image: 'data:image/png;base64,' + base64Small})
          } else console.log('Image could not be saved')
        })
        .catch(e => {
          console.log('from asset error:', e)
        })
    }
  }
}
