import { INPUT_01 } from "./input";

console.log('1er décembre 2018');

console.log('part 1');

console.log(INPUT_01.split('\n')
    .reduce((acc, s) => {
        const n: number = Number.parseInt(s.substr(1));
        return s[0] === '+' ? acc + n : acc - n;
    }, 0));

console.log('part 2');

let ref: number = 0;
const dict: {[key: number]: boolean} = {};

while (!INPUT_01.split('\n').some(s => {
    let r: boolean = false;
    const n: number = Number.parseInt(s.substr(1));
    ref += s[0] === '+' ? n : -n;
    r = dict[ref];
    dict[ref] = true;
    if (r) {
        console.log(ref);
    }
    return r;
}));
