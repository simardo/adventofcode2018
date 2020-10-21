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

type Segment = {
    dist: number;
    e: number;
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
doPart2(DAY_23_INPUT);

export function doPart2(input: string): void {
    const bots: Bot[] = buildMap(input);

    const segments: Segment[] = [];
    bots.forEach(b => {
        const distance: number = Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.z);
        segments.push({
            dist: Math.max(0, distance - b.r),
            e: 1
        });
        segments.push({
            dist: distance + b.r,
            e: -1
        });
    });

    let count: number = 0;
    let maxCount: number = 0;
    let result: number = 0;

    const queue: Segment[] = segments.sort((a,b) => a.dist < b.dist ? -1 : a.dist > b.dist ? 1 : 0).reverse();
    while (queue.length > 0) {
        const s: Segment = queue.pop()!;
        count += s.e;
        if (count > maxCount) {
            result = s.dist;
            maxCount = count;
        }
    }

    console.log(result);
}
