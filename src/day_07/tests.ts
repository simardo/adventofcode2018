import { doPart1, doPart2 } from './puzzle';

const input: string =
`Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;

console.log(doPart1(input));
console.log(doPart2(input, 2, 2));
