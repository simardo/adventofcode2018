import { doPart1, doPart2 } from './puzzle';

const input: string =
    `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`;

console.log(doPart1(input) === 4);
console.log(doPart2(input) === '3');
