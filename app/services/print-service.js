import store from "../store"

export default class PrintService {

  prepareTicket(preparationAreaId,orderId) {
    console.log("area printing areaId: " + preparationAreaId + " orderId: " + orderId) 
    let port = 9100
    let ip = ''
    if (TNS_ENV != 'production') {
        if (platformModule.isAndroid) ip = '10.0.2.2'
        let prepIp = store.getters('preparationAreaById', preparationAreaId).printerIp
        port = prepIp.substring(prepIp.indexOf(":"))
    }
    var esc = '\x1B'; //ESC byte in hex notation
    var newLine = '\x0A'; //LF byte in hex notation
    var cmds = esc + "@"; //Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    cmds += 'BEST DEAL STORES'; //text to print
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += 'COOKIES                   5.00'; 
    cmds += newLine;
    cmds += 'MILK 65 Fl oz             3.78';
    cmds += newLine + newLine;
    cmds += 'SUBTOTAL                  8.78';
    cmds += newLine;
    cmds += 'TAX 5%                    0.44';
    cmds += newLine;
    cmds += 'TOTAL                     9.22';
    cmds += newLine;
    cmds += 'CASH TEND                10.00';
    cmds += newLine;
    cmds += 'CASH DUE                  0.78';
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x18'; //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
    cmds += '# ITEMS SOLD 2';
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += newLine + newLine;
    cmds += '11/03/13  19:53:17';
    this.printTicket(ip,port,cmds)
  }

  receiptTicket(orderId) {
      console.log("receipt printing for order: " + orderId)
  }

  printTicket(ip, port, content) {
    console.log("printing on ip: " + ip + ' port:' + port)
    if (platformModule.isIOS)
      alert("IOS printer not supported yet!")
    else {
      var printClient = new PrintClient(0);
      printClient.onData = (data) => {
        console.log("Data from Printer: ", data);
      };
      printClient.onError = (id, message) => {
          console.log("Print client error for action #", id, ": ", message);
      };    printClient.connect(ip, port);
      printClient.onConnected = (id) => {
        console.log("Print client connected action #: ", id);
        var message = content
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
