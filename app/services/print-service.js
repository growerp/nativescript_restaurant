import store from "../store"
import {PrintClient} from "nativescript-ichi-printer";
import { traceMessageType } from "tns-core-modules/ui/page/page";
const defaultIpAndroid = '10.0.2.2'
const defaultIpReal = '192.168.1.23'
const defaultIp = defaultIpAndroid
const platformModule = require("tns-core-modules/platform")
const esc = '\x1B'; //ESC byte in hex notation
const newLine = '\x0A'; //LF byte in hex notation
const cut = '\x1D\x56\x42\x03' // cut with 3 linefeeds
const tabs = '\x1B\x44\x05\x0A\x28\x32\x00'
const tab = '\x09'
const doubleHeight = esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex

export default class PrintService {
  prepareTicket(orderItem) {
    console.log("area printing orderId: " + orderItem.orderId + 
    ' partId: ' + orderItem.orderPartSeqId + ' prepAreaId: ' + orderItem.preparationAreaId)
    //console.log("===orderItem: " + JSON.stringify(orderItem))
    let ip = store.getters.preparationAreaById(orderItem.preparationAreaId).printerIp
    let cmds = esc + "@"; //Initializes the printer (ESC @)
    // cmds += '012345678901234567890123456789012345678901234567890123456789' + newLine
    cmds += doubleHeight
    let comp = store.getters.company.organizationName
    cmds += this.center(comp) + comp + newLine + newLine;
    let prep = orderItem.prepDescription
    cmds += this.center(prep) + prep + newLine + newLine;
    cmds += orderItem.description + '-' + orderItem.spotNumber + newLine + newLine;
    orderItem.items.forEach(a => {
      cmds += a.quantity + '   ' + a.description + '   ' + newLine;
    })
    this.printTicket(ip,cmds)
  }

  receiptTicket(order) {
      console.log("receipt printing for order: " + order.orderId)
      // console.log("===order: " + JSON.stringify(order))
      let cmds = esc + "@"; //Initializes the printer (ESC @)
      // cmds += '012345678901234567890123456789012345678901234567890123456789' + newLine
      cmds += doubleHeight
      let comp = store.getters.company.organizationName
      cmds += this.center(comp) + comp + newLine + newLine;
      cmds += tabs
      cmds += tab + 'Quant.' + tab + 'Decription' + tab + 'price' + tab + 'Total' + newLine;
      order.items.forEach(a => {
        cmds += tab + a.quantity + tab + a.description + tab + a.price + tab + a.totalAmount + newLine;
      })
      cmds += 'Grand total: ' + order.grandTotal + newLine + newLine;
      let prepAreas = store.getters.preparationAreas
      let ip = ''
      prepAreas.forEach(o => { if (o.nbrOfCatg == 0) ip = o.printerIp})
      this.printTicket(ip,cmds)
    }

  center(str) {
    return this.numberOfSpaces((60 - str.length) / 2 | 0) // whole numbers only
  }
  numberOfSpaces(amount) {
    let str = ''; while(amount--) str += ' '; return str
  }
  printTicket(ip, content) {
    let port = 9100
    if (ip && ip.indexOf(":") != -1) { //if port specified extract ip and port
      port = parseInt(ip.substring(ip.indexOf(":")+1),10)
      ip = ip.substring(0, ip.indexOf(":"))
    }
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
        var message = content + cut
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
