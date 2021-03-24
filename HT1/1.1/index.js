import {pipeline} from 'stream';
import reversePipe from './reverse-pipe';

pipeline(
  process.stdin,
  reversePipe,
  process.stdout,
  (error) => {
    console.error(error);
  }
)
