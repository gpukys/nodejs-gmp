const {pipeline} = require('stream');
const reversePipe = require('./reverse-pipe');

pipeline(
  process.stdin,
  reversePipe,
  process.stdout,
  (error) => {
    console.error(error);
  }
)
