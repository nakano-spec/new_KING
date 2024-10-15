var crypto = require('crypto');

function encryptdata(data){
    const sha512 = crypto.createHash('sha512');
    sha512.update(data);
    var sha512Hash = sha512.digest(encoding);
    return sha512Hash;
}

module.exports = encryptdata
