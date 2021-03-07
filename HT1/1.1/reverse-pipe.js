const {Transform} = require('stream');

class Reverse extends Transform {
  _transform(data, encoding, callback) {
    callback(null, Buffer.concat([data.reverse().slice(1), Buffer.from([0x0A])]));
  }
}

module.exports = new Reverse();