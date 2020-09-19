import { DAY_09_INPUT } from './input';

console.log('DAY 09');

type Marble = {
    value: number;
    previous: Marble;
    next: Marble;
}

function doGame(numPlayer: number, numMarbles: number): number {
    const players: number[] = new Array(numPlayer).fill(0);
    const circle: Marble = { value: 0 } as Marble;
    circle.previous = circle;
    circle.next = circle;

    let currentPlayer: number = 0;
    let currentMarble: Marble = circle;
    let nextMarble: number = 1;
    while (nextMarble <= numMarbles) {
        if (nextMarble % 23 === 0) {
            for (let i: number = 7; i >= 1; i--) {
                currentMarble = currentMarble.previous;
            }

            const points: number = currentMarble.value;

            currentMarble.previous.next = currentMarble.next;
            currentMarble.next.previous = currentMarble.previous;
            currentMarble = currentMarble.next;

            players[currentPlayer] = players[currentPlayer] + nextMarble + points;
        } else {
            currentMarble = currentMarble.next;

            const newMarble: Marble = { value: nextMarble } as Marble;
            newMarble.next = currentMarble.next;
            newMarble.next.previous = newMarble;
            newMarble.previous = currentMarble;
            newMarble.previous.next = newMarble;
            currentMarble = newMarble;
        }

        currentPlayer++;
        if (currentPlayer === players.length) {
            currentPlayer = 0;
        }
        nextMarble++;
    }

    return players.reduce((p, c) => Math.max(p, c), 0);
}

// PART 1
console.log(doPart1(DAY_09_INPUT));

export function doPart1(input: string): number {
    const rx: RegExp = /(\d+)\splayers.+worth\s(\d+)/g;

    const match: RegExpMatchArray | null = rx.exec(input);

    return doGame(Number.parseInt(match![1]), Number.parseInt(match![2]));
}

// PART 2
console.log(doPart2(DAY_09_INPUT));

export function doPart2(input: string): number {
    const rx: RegExp = /(\d+)\splayers.+worth\s(\d+)/g;

    const match: RegExpMatchArray | null = rx.exec(input);

    return doGame(Number.parseInt(match![1]), Number.parseInt(match![2]) * 100);
}
