//CONFIGURATION HERE
const middleserver = "http://192.168.0.237:4000";
const emailaccount = "swc3403@iotuser" //USED FOR CONTROLLING FROM SPECIFIED USER
const listGPIO = [5, 6, 16, 17, 22, 23, 24, 25, 26, 27]; //LIST AVAILABLE GPIO PINS
//END OF CONFIGURATION



const { io } = require("socket.io-client");
const socket = io(middleserver);
var Gpio = require('onoff').Gpio;
const gpioDeclarations = [];
for (let i = 0; i < listGPIO.length; i++) {
    gpioDeclarations.push({ gpionumber: listGPIO[i], gpioobj: new Gpio(listGPIO[i], 'out') });
}

socket.on("connect", () => {
    console.log("CONNECTED TO SERVER: " + socket.id);
    socket.emit("getdetails", { clienttype: "receiversystem", receiveraccount: emailaccount});
    socket.emit("joincontrolroom", emailaccount);
});
socket.on("disconnect", () => {
    console.log("DISCONNECTED FROM SERVER");
});
socket.on("receiveactions", (arg) => {
    if(arg.emailaccount != emailaccount){
        return;
    }
    switch (arg.action) {
        case 'listgpio':
            socket.emit("sendlistgpiotouser", {emailaccount: emailaccount, listgpio: listGPIO});
            break;
        case 'iotcontrol':
            gpioDeclarations[3].gpioobj.writeSync(arg.state);
            break;
        default:
            break;
    }
    console.log("RECEIVE: " + JSON.stringify(arg));
});
