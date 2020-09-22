import { doPart1 } from './puzzle';

const initialState: string = '#..#.#..##......###...###';

const input: string =
    `...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

console.log(doPart1(initialState, input, 20));
