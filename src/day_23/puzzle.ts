import { DAY_23_INPUT } from './input';

console.log('DAY 23');

type Bot = {
    x: number;
    y: number;
    z: number;
    r: number;
}

function buildMap(input: string): Bot[] {
    const rx: RegExp = /pos=<(-?\d+),(-?\d+),(-?\d+)>,\sr=(-?\d+)/g;

    const bots: Bot[] = [];

    let match: RegExpMatchArray | null;
    while ((match = rx.exec(input)) !== null) {
        bots.push({
            x: Number.parseInt(match[1]),
            y: Number.parseInt(match[2]),
            z: Number.parseInt(match[3]),
            r: Number.parseInt(match[4])
        });
    }

    return bots;
}

type Range = {
    a: number;
    b: number;
    c: Boundaries;
}

type Boundaries = {
    lo: number;
    hi: number;
}

type RangeMap = {
    [key: string]: RangeMapItem;
}

type RangeMapItem = {
    [key: number]: boolean;
}

function inRange(minA: number, maxA: number, minB: number, maxB: number): Boundaries | undefined {
    const min: number = Math.max(minA, minB);
    const max: number = Math.min(maxA, maxB);

    if (min <= max) {
        return {
            lo: min,
            hi: max
        }
    } else {
        return undefined;
    }
}

function getRangeKey(range: Range): string {
    return `lo:${range.c.lo},hi:${range.c.hi}`;
}

function getRanges(bots: Bot[], coordfn: (b: Bot) => number): Range[] {
    const result: Range[] = [];

    for (let i: number = 0; i < bots.length; i++) {
        const b: Bot = bots[i];
        for (let j: number = i; j < bots.length; j++) {
            const bb: Bot = bots[j];
            const minb: number = coordfn(b) - b.r;
            const maxb: number = coordfn(b) + b.r;
            const minbb: number = coordfn(bb) - bb.r;
            const maxbb: number = coordfn(bb) + bb.r;

            const inRangeCoord: Boundaries | undefined = inRange(minb, maxb, minbb, maxbb);
            if (inRangeCoord !== undefined) {
                result.push({
                    a: i,
                    b: j,
                    c: inRangeCoord
                });
            }
        }
    }

    return result;
}

function getRangeMap(ranges: Range[]): RangeMap {
    const result: RangeMap = {};

    for (let i: number = 0; i < ranges.length; i++) {
        const r: Range = ranges[i];
        const k: string = getRangeKey(r);
        if (result[k] === undefined) {
            result[k] = {};
        }
        result[k][r.a] = true;
        result[k][r.b] = true;
        for (let j: number = 0; j < ranges.length; j++) {
            const rr: Range = ranges[j];
            if (r !== rr && inRange(r.c.lo, r.c.hi, rr.c.lo, rr.c.hi)) {
                result[k][rr.a] = true;
                result[k][rr.b] = true;
            }
        }
    }

    return result;
}

// PART 1
doPart1(DAY_23_INPUT);

export function doPart1(input: string): void {
    const bots: Bot[] = buildMap(input);

    const strongest: Bot = bots.reduce((p, b) => p === undefined || b.r > p.r ? b : p, undefined!);

    const inRange: number = bots.reduce((p, b) => {
        const d: number = Math.abs(strongest.x - b.x) + Math.abs(strongest.y - b.y) + Math.abs(strongest.z - b.z);
        if (d <= strongest.r) {
            p++;
        }
        return p;
    }, 0);

    console.log(strongest, inRange);
}

// PART 2
// doPart2(DAY_23_INPUT);

export function doPart2(input: string): void {
    const bots: Bot[] = buildMap(input);
    const rangesX: Range[] = getRanges(bots, b => b.x);
    const rangeXMap: RangeMap = getRangeMap(rangesX);

    const rangesY: Range[] = getRanges(bots, b => b.y);
    const rangeYMap: RangeMap = getRangeMap(rangesY);

    const rangesZ: Range[] = getRanges(bots, b => b.z);
    const rangeZMap: RangeMap = getRangeMap(rangesZ);

    console.log(bots);

    console.log(rangesX);
    console.log(rangesY);
    console.log(rangesZ);

    console.log(rangeXMap);
    console.log(rangeYMap);
    console.log(rangeZMap);
}
