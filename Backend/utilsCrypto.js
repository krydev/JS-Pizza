var crypto = require('crypto');

function base64(str) {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.sha1 = sha1;
exports.base64 = base64;