import { doPart1, doPart2 } from './puzzle';

const input: string =
    `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;

const input2: string =
    `x=490, y=5..12
y=12, x=490..504
x=504, y=4..12
x=494, y=7..10
y=10, x=494..499
x=499, y=7..10`;

doPart1(input);
doPart2(input);
