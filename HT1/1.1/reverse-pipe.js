import {Transform} from 'stream';

class Reverse extends Transform {
  _transform(data, encoding, callback) {
    callback(null, Buffer.concat([data.reverse().slice(1), Buffer.from([0x0A])]));
  }
}

export default new Reverse();