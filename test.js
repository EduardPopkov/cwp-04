var crypto = require('crypto');
var key = "TheKey%%12312312";
var text = "Have a good day";
var enc = crypto.createCipher('aes-256-ctr', key).update(text, 'utf8', 'hex');
var dec = crypto.createDecipher('aes-256-ctr', key).update(enc, 'hex', 'utf8');
console.log(enc);
console.log(dec);
