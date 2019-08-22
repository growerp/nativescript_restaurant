import ImageSource from "tns-core-modules/image-source"
var platformModule = require("tns-core-modules/platform");
var permissions = require("nativescript-permissions");
var camera = require("nativescript-camera");
var imagepicker = require("nativescript-imagepicker");

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
            saveToGallery:true })
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
        let localPath = null
        let context = imagepicker.create({mode: 'single'})
        if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
            permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE,
                    "I need these permissions to read a picture from galery")
            .then(function() {
                    console.log("Permissions granted!");
                    startSelection(context)})
            .catch(function() {
                    console.log("Uh oh, no permissions - plan B time?")})}
        context.authorize()
        .then(function() {
            return context.present()})
        .then((selection) => {
          console.log("Selection done: " + JSON.stringify(selection))
          this.scaleUploadImage(type, id, selection[0])
        }).catch(function(e) {
          console.log('====error picture selection:' + e)
        })
      },
      scaleUploadImage(type,id, selected_item) {
        const fileSystemModule = require("tns-core-modules/file-system")
        const imageSourceModule = require("tns-core-modules/image-source")
        const BitmapFactory = require("nativescript-bitmap-factory")
        imageSourceModule.fromAsset(selected_item)
        .then((imageSource) => {
          const folder = fileSystemModule.knownFolders.documents().path;
          const fileName = "growerp" + Math.floor(Math.random() * 1000) + ".png";
          const path = fileSystemModule.path.join(folder, fileName);
          const saved = imageSource.saveToFile(path, "png")
          if (saved) {
            this.itemImage = path // show onscreen
            // create bitmap to be resized
            const image = imageSourceModule.fromFile(this.itemImage)
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
            this.item.image = 'data:image/png;base64,' + base64Small
            this.$backendService.uploadImage('small', base64Small, type, id)
            this.$backendService.uploadImage('medium', base64Medium, type, id)
          } else console.log('Image could not be saved')
        })
      }
  }
}
