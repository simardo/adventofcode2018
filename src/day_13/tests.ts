import fs from 'fs';
import { doPart1, doPart2 } from './puzzle';

console.log(doPart1(fs.readFileSync('./src/day_13/tests.txt', 'utf8')));
console.log(doPart2(fs.readFileSync('./src/day_13/tests2.txt', 'utf8')));
