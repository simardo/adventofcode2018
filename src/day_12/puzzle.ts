import { DAY_12_INITIAL_STATE, DAY_12_INPUT } from './input';

console.log('DAY 12');

type Pot = {
    id: number;
    hasPlant: boolean;
    nextGenValue?: boolean;
    left?: Pot;
    right?: Pot
}

type GenNotes = { [key: string]: string };

function setInitialState(initialState: string): Pot {
    const pots: string[] = [...initialState];
    let r: Pot | undefined = undefined;

    let lastPot: Pot | undefined = undefined;
    let id: number = 0;
    pots.forEach((p, i) => {
        const pot: Pot = {
            id: id++,
            hasPlant: p === '#',
        }

        if (lastPot !== undefined) {
            pot.left = lastPot;
            lastPot.right = pot;
        }

        if (r === undefined) {
            r = pot;
        }

        lastPot = pot;
    });

    fillLeft(r!);
    fillRight(r!);

    return r!;
}

function getLeftMostPot(pot: Pot): Pot {
    let leftMost: Pot = pot;
    let current: Pot | undefined = pot;

    while (current !== undefined) {
        if (current.left !== undefined) {
            leftMost = current.left;
        }
        current = current.left;
    }

    return leftMost;
}

function getRightMostPot(pot: Pot): Pot {
    let rightMost: Pot = pot;
    let current: Pot | undefined = pot;

    while (current !== undefined) {
        if (current.right !== undefined) {
            rightMost = current.right;
        }
        current = current.right;
    }

    return rightMost;
}

function fillLeft(pot: Pot): void {
    let ok: boolean = false;

    while (!ok) {
        let leftMost: Pot = getLeftMostPot(pot);

        ok = true;
        let current: Pot = leftMost;
        for (let i: number = 1; i <= 5 && ok; i++) {
            if (current.hasPlant) {
                ok = false;
            } else {
                current = current.right!;
            }
        }
        if (!ok) {
            const potL: Pot = {
                id: leftMost.id - 1,
                hasPlant: false
            }
            potL.right = leftMost;
            leftMost.left = potL;
        }
    }
}

function fillRight(pot: Pot): void {
    let ok: boolean = false;

    while (!ok) {
        let rightMost: Pot = getRightMostPot(pot);

        ok = true;
        let current: Pot = rightMost;
        for (let i: number = 1; i <= 5 && ok; i++) {
            if (current.hasPlant) {
                ok = false;
            } else {
                current = current.left!;
            }
        }
        if (!ok) {
            const potL: Pot = {
                id: rightMost.id + 1,
                hasPlant: false
            }
            potL.left = rightMost;
            rightMost.right = potL;
        }
    }
}

function toString(pot: Pot): string {
    const s: string[] = [];

    let p: Pot | undefined = getLeftMostPot(pot);
    while (p !== undefined) {
        s.push(p.hasPlant ? '#' : '.');
        p = p.right;
    }

    return s.join('');
}

function nextGeneration(pot: Pot, genNotes: GenNotes): void {
    let current: Pot = getLeftMostPot(pot);
    current = current.right!.right!;

    while (current.right!.right !== undefined) {
        const pattern: string[] = [];
        pattern.push(current.left!.left!.hasPlant ? '#' : '.');
        pattern.push(current.left!.hasPlant ? '#' : '.');
        pattern.push(current.hasPlant ? '#' : '.');
        pattern.push(current.right!.hasPlant ? '#' : '.');
        pattern.push(current.right!.right!.hasPlant ? '#' : '.');

        const patternS: string = pattern.join('');
        const newValue: string | undefined = genNotes[patternS];
        current.nextGenValue = newValue !== undefined ? newValue == '#' : false;

        current = current.right!;
    }

    current = getLeftMostPot(pot);
    while (current !== undefined) {
        current.hasPlant = current.nextGenValue!;
        current = current.right!;
    }
}

function calcGenResult(pot: Pot): number {
    let result: number = 0;
    let current: Pot | undefined = getLeftMostPot(pot);
    while (current !== undefined) {
        if (current.hasPlant) {
            result += current.id;
        }
        current = current.right;
    }

    return result;
}

// PART 1
console.log(doPart1(DAY_12_INITIAL_STATE, DAY_12_INPUT, 200));

// PART 2
console.log(doPart1(DAY_12_INITIAL_STATE, DAY_12_INPUT, 500));


export function doPart1(initialState: string, notes: string, numGen: number): number {
    const pot0: Pot = setInitialState(initialState);

    const genNotes: GenNotes = {};
    notes.split('\n').forEach(n => genNotes[n.substr(0, 5)] = n.slice(-1));

    let lastResult: number = 0;
    for (let g: number = 1; g <= numGen; g++) {
        nextGeneration(pot0, genNotes);
        fillLeft(pot0);
        fillRight(pot0);

        const genResult = calcGenResult(pot0);

        console.log(g, genResult, genResult - lastResult);
        lastResult = genResult;
    }

    return calcGenResult(pot0);
}
