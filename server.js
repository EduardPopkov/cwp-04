const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const port = 8124;

var id = 0;
var nameDir;

const server = net.createServer((client) => {
  console.log('--------------- Connected client: ' + (++id) + ' ---------------');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    //console.log(data);
    if(data == 'REMOTE'){
      client.write('ASK' + id.toString());
    }
    else if(data == 'DEC') {
      client.write('DEC');
    }
    else if(data.indexOf('COPY') == 0){
      let someString = data.substring(4).split(',');

      let input = fs.createReadStream(someString[0], 'utf8');
      let output = fs.createWriteStream(someString[1]);

      //pipe - берёт поток на чтение и соед его с потоком на запись
      input.pipe(output);

      client.write('COPYOK');
    }
    else if(data.indexOf('ENCODE') == 0){
      let someString = data.substring(6).split(',');
      //console.log(someString);

      let input = fs.createReadStream(someString[0]);
      let output = fs.createWriteStream(someString[1]);

      input.pipe(output);

      var text = fs.readFileSync('./text.txt', 'utf8');
      var enc = crypto.createCipher('aes-256-ctr', someString[2]).update(text, 'utf8', 'hex');

      fs.writeFileSync(someString[1], enc);
      client.write('ENCODEOK');
    }
    else if(data.indexOf('DECODE') == 0){
      let someString = data.substring(6).split(',');

      let input = fs.createReadStream(someString[0]);
      let output = fs.createWriteStream(someString[1]);

      input.pipe(output);

      var text = fs.readFileSync(someString[0], 'utf8');
      var dec = crypto.createDecipher('aes-256-ctr', someString[2]).update(text, 'hex', 'utf8');

      fs.truncate(someString[1], 0, function() {
        fs.writeFileSync(someString[1], dec);
      });

      client.write('DECODEOK');
    }
  });
  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
