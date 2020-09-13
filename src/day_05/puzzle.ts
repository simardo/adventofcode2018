import { DAY_05_INPUT } from './input';

function destroy(sv: string[]): string[] {
    let pos: number = 1;

    while (pos < sv.length) {
        if (Math.abs(sv[pos].charCodeAt(0) - sv[pos - 1].charCodeAt(0)) === 32) {
            sv[pos] = '';
            sv[pos - 1] = '';
        }
        pos++;
    }

    return sv;
}

function reduce(sv: string[]): string[] {
    return sv.reduce((p, c) => {
        if (c !== '') {
            p.push(c);
        }
        return p;
    }, [] as string[]);
}

function getProduction(sv: string[]): number {
    let d: string[];

    do {
        d = destroy(sv);
        sv = reduce(d);
    } while (d.length != sv.length);

    return sv.length;
}

// PART 1
console.log(doPart1(DAY_05_INPUT));

export function doPart1(input: string): number {
    let s: string[] = [...input];

    return getProduction(s);
}

// PART 2
console.log(doPart2(DAY_05_INPUT));

export function doPart2(input: string): number {
    let s: string[] = [...input];

    let min: number = Number.MAX_VALUE;

    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
        const l: string = String.fromCharCode(i);

        const sv: string[] = s.reduce((p, c) => {
            if (!(c === l || c === l.toLowerCase())) {
                p.push(c);
            }
            return p;
        }, [] as string[]);

        min = Math.min(min, getProduction(sv));
    }

    return min;
}
