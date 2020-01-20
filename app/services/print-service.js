import store from "../store"
import {PrintClient} from "nativescript-ichi-printer";
const platformModule = require("tns-core-modules/platform")
const defaultIp = platformModule.isAndroid? '10.0.2.2': 'localhost'
const esc = '\x1B'; //ESC byte in hex notation
const test = '012345678901234567890123456789012345678901234567' // width 80mm
const newLine = '\x0A'; //LF byte in hex notation
const cut = newLine + newLine + '\x1D\x56\x42\x00'
const tabs = '\x1B\x44\x05\x0F\x1D\x28\x00'
const tab = '\x09'
const reset = esc + "@"
const center = '\x1B\x61\x01'
const doubleHeightOn = '\x1B\x21\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
const doubleHeightOff= '\x1B\x21\x00'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
export default class PrintService {
  prepareTicket(orders) { // multiple orderrecords as found in store/modules/orders.js
    let result = ''
    orders.forEach(order => {
      console.log("area printing orderId: " + order.orderId + 
        ' prepAreaId: ' + order.preparationAreaId)
      let ip = store.getters.preparationAreaById(order.preparationAreaId).printerIp
      if (ip) {
        let cmds = center + order.prepDescription + ' >>>>>> ' + 
            order.table + newLine + newLine;
        cmds += tabs
        order.items.forEach(a => {
          cmds += tab + a.description + tab + a.quantity + newLine;
        })
        result = this.printTicket(ip,cmds)
      } else {
        result = 'Printer not defined'
      }
    })
    return result
  }

  receiptTicket(orderId) {
      console.log("receipt printing for order: " + orderId)
      let ip = store.getters.billingArea.printerIp
      if (ip) {
        let order = store.getters.openOrderById(orderId)
        let cmds = center + order.table + newLine + newLine
        cmds += tabs
        cmds += tab + 'Quant.' + tab + 'Decription' + tab + 'price' + tab + 'Total' + newLine;
        console.log("====2===== items: " + order.items.length)
        order.items.forEach(a => {
          cmds += tab + a.quantity + tab + a.description + tab + a.price 
            + tab + a.totalAmount + ' ' + store.getters.company.currencyId + newLine;
        })
        cmds += tab + tab + 'Grand total: ' + tab + tab + order.grandTotal + ''
          + store.getters.company.currencyId + newLine
        this.printTicket(ip,cmds)
      } else {
        return 'Printer not defined'
      }
  }

  printTicket(ip, content) {
    console.log("Incoming printer ip: " + ip)
    const header = reset + doubleHeightOn + center + 
    store.getters.company.organizationName + doubleHeightOff +
    newLine + newLine 
    let port = 9100
    if (ip && ip.indexOf(":") != -1) { //if port specified extract ip and port
      port = parseInt(ip.substring(ip.indexOf(":")+1),10)
      ip = ip.substring(0, ip.indexOf(":"))
    }
    if (!ip)
    if (TNS_ENV != 'production') {
        if (platformModule.isAndroid) ip = defaultIp
    }
    if (!ip || !port) return 'printerIp and/or port not defined'

    console.log("printing on ip: " + ip + ' port: ' + port)
    if (platformModule.isIOS)
      alert("IOS printer not supported yet!")
    else {
      var printClient = new PrintClient(0);
      printClient.onData = (data) => {
        console.log("Data from Printer: ", data);
      };
      printClient.onError = (id, message) => {
          console.log("Print client error for action #", id, ": ", message);
      };
      printClient.connect(ip, port);
      printClient.onConnected = (id) => {
        console.log("Print client connected action #: ", id);
        var message = header + content + cut
        var bytes = [];
        for (var i = 0; i < message.length; i++) {
            var c = message.charCodeAt(i);
            bytes.push(c & 0xFF);
        }
        bytes.push(0x0A);
        printClient.send(bytes);
      };
      printClient.onSent = (id) => {
          console.log("Print client sent action #: ", id);
          // When we are finished
          printClient.close();
      };
      printClient.onClosed = (id) => {
        console.log("Print client closed action #: ", id);
      };
    }      
  }
}
