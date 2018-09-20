const fs = require('fs');
const net = require('net');
const exec = require('child_process');
const crypto = require('crypto');
const port = 8124;

var clientCount;

const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function () {
  console.log('------------------- Connected -------------------');
  sendREMOTE(client);
});
/////////////////////////////////////////////////////
client.on('data', function (data) {
  if(data.indexOf('ASK') == 0){
    clientCount = data.substring(3);
    sendCopyFile(client);
  }
  else if(data == 'DEC'){
    client.destroy();
  }
  else if(data == 'COPYOK'){
    sendENCODE(client);
  }
  else if(data == 'ENCODEOK'){
    sendDECODE(client);
  }
  else if(data == 'DECODEOK'){
    client.destroy();
  }
});
/////////////////////////////////////////////////////
function sendCopyFile(client){
  let nameOriginal = './text.txt';
  let nameCopy = './copy' + clientCount + '.txt';
  client.write('COPY'+ nameOriginal + ',' + nameCopy);
}
/////////////////////////////////////////////////////
function sendREMOTE(client) {
  client.write('REMOTE');
};
/////////////////////////////////////////////////////
function sendDECODE(client) {
  let nameEncode = './encode' + clientCount + '.txt';
  let nameDecode = './decode' + clientCount + '.txt';
  let key = 'TheKey%%123';
  client.write('DECODE' + nameEncode + ',' + nameDecode +',' + key);
}
/////////////////////////////////////////////////////
function sendENCODE(client) {
  let nameOriginal = './copy' + clientCount + '.txt';
  let nameCopy = './encode' + clientCount + '.txt';
  let key = 'TheKey%%123';
  client.write('ENCODE' + nameOriginal + ',' + nameCopy +',' + key);
}
/////////////////////////////////////////////////////
client.on('close', function () {
  console.log('Connection closed');
});
