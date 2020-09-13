import { DAY_03_INPUT } from './input';

type Fabric = {
    claims: { [key: number]: boolean },
    squares: { [key: string]: string[] }
}

type Claim = {
    x: number;
    y: number;
    id: string;
    key: string;
}

function buildFabric(input: string): Fabric {
    const o: Fabric = {
        claims: {},
        squares: {}
    };

    let m: Generator<RegExpMatchArray> = iterMatch(input);
    let i: IteratorResult<RegExpMatchArray> | undefined = m.next();

    while (!i.done) {
        let mm: Generator<Claim> = processMatch(i.value);
        let ii: IteratorResult<Claim> = mm.next();

        while (!ii.done) {
            if (o.claims[ii.value.id] === undefined) {
                o.claims[ii.value.id] = true;
            }

            if (o.squares[ii.value.key] === undefined) {
                o.squares[ii.value.key] = [ii.value.id];
            } else {
                o.squares[ii.value.key].push(ii.value.id);
            }
            ii = mm.next();
        }

        i = m.next();
    };

    return o;
}

function* iterMatch(s: string): Generator<RegExpMatchArray> {
    const rx: RegExp = /#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/g;

    let match: RegExpMatchArray | null;

    while ((match = rx.exec(s)) !== null) {
        yield match;
    }
}

function* processMatch(m: RegExpMatchArray): Generator<Claim> {
    const i: string = m[1];
    const x: number = Number.parseInt(m[2]);
    const y: number = Number.parseInt(m[3]);

    const w: number = Number.parseInt(m[4]);
    const h: number = Number.parseInt(m[5]);

    const r: string[] = [];

    for (let xx: number = x; xx < x + w; xx++) {
        for (let yy: number = y; yy < y + h; yy++) {
            yield {
                x: xx,
                y: yy,
                id: i,
                key: `${xx},${yy}`
            };
        }
    }
}

// PART 1
export function doPart1(input: string): number {
    return Object.values(buildFabric(input).squares).filter(v => v.length > 1).length;
}

console.log(doPart1(DAY_03_INPUT));

// PART 2
export function doPart2(input: string): string {
    const f: Fabric = buildFabric(input);
    Object.values(f.squares).forEach(s => {
        if (s.length > 1) {
            s.forEach(i => f.claims[i] = false);
        }
    });

    const r = Object.keys(f.claims).filter(c => f.claims[c] === true);
    if (r.length === 1) {
        return r[0];
    } else {
        return 'fail';
    }
}

console.log(doPart2(DAY_03_INPUT));
