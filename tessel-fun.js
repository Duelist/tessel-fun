var tessel = require('tessel');
var blePort = tessel.port['D'];
var bleLib = require('ble-ble113a');
 
var ble = bleLib.use(blePort, function(err) {
  if (err) return console.log("Error connecting to slave", err);
 
  ble.setAdvertisingData(createIBeaconAdvertisementPacket(0, 0), function (e2){
    if (e2) console.log("Error setting advertisement packet", e2);
    ble.startAdvertising(function(e3) {
      if (e3) return console.log("Err starting to advertise", e3);
      console.log('waiting to be discovered...');
    });
  });
});

function createIBeaconAdvertisementPacket(major, minor, peripheral) {
  var flags = new Buffer([0x02, 0x01, 0x06]);
  var manufacturerData = new Buffer([0x1a, 0xff]);
  var preamble = new Buffer([0x4c, 0x00, 0x02, 0x15]);
  var airLocate = new Buffer([0x91, 0xbf, 0x54, 0xab, 0x4a, 0xc1, 0x4a, 0x2e, 0x84, 0xff, 0x8c, 0xf5, 0x16, 0x49, 0x29, 0xb6]);

  var majorBuf = new Buffer(2);
  majorBuf.writeUInt16BE(major, 0);

  var minorBuf = new Buffer(2);
  minorBuf.writeUInt16BE(minor, 0);

  var signalStrength = 0xc6
  if (peripheral) {
    signalStrength = peripheral.rssi;
  }

  return Buffer.concat([flags, manufacturerData, preamble, airLocate, majorBuf, minorBuf, new Buffer([signalStrength])]);
}

