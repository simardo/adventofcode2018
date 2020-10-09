import { DAY_18_INPUT } from './input';

console.log('DAY 18');

type Acre = {
    x: number,
    y: number,
    t: string;
    next: string | undefined;
    siblings: Acre[];
}

function render(map: string[][], acres: Acre[]): void {
    console.log(map.map((l, y) => l.map((r, x) => acres.find(a => a.x === x && a.y === y)!.t).join('')).join('\n'));
}

// PART 1
console.log(doPart1(DAY_18_INPUT, 10));

// PART 2
console.log(doPart1(DAY_18_INPUT, 2000));

export function doPart1(input: string, minutes: number): number {
    const map: string[][] = input.split('\n').map(l => [...l]);
    const acres: Acre[] = map.reduce((p, r, y) => p.concat(r.map((c, x) => {
        return {
            x: x,
            y: y,
            t: c,
            next: undefined,
            siblings: []
        } as Acre;
    })), [] as Acre[]);

    acres.forEach(a => {
        if (a.x > 0) {
            for (let y: number = Math.max(0, a.y - 1); y <= Math.min(map.length - 1, a.y + 1); y++) {
                a.siblings.push(acres.find(aa => aa.x === a.x - 1 && aa.y === y)!);
            }
        }
        if (a.x < map[a.x].length - 1) {
            for (let y: number = Math.max(0, a.y - 1); y <= Math.min(map.length - 1, a.y + 1); y++) {
                a.siblings.push(acres.find(aa => aa.x === a.x + 1 && aa.y === y)!);
            }
        }
        if (a.y > 0) {
            a.siblings.push(acres.find(aa => aa.x === a.x && aa.y === a.y - 1)!);
        }
        if (a.y < map.length - 1) {
            a.siblings.push(acres.find(aa => aa.x === a.x && aa.y === a.y + 1)!);
        }
    });

    render(map, acres);

    let lastWood: number = 0;
    let lastYard: number = 0;

    for (let m: number = 1; m <= minutes; m++) {
        acres.forEach(a => {
            if (a.t === '.' && a.siblings.reduce((p, s) => s.t === '|' ? p + 1 : p, 0) >= 3) {
                a.next = '|';
            } else if (a.t === '|' && a.siblings.reduce((p, s) => s.t === '#' ? p + 1 : p, 0) >= 3) {
                a.next = '#';
            } else if (a.t === '#' && !(a.siblings.reduce((p, s) => s.t === '#' ? p + 1 : p, 0) >= 1 && a.siblings.reduce((p, s) => s.t === '|' ? p + 1 : p, 0) >= 1)) {
                a.next = '.';
            } else {
                a.next = a.t;
            }
        });
        acres.forEach(a => a.t = a.next!);

        // part 2
        const wood: number = acres.reduce((p, a) => a.t === '|' ? p + 1 : p, 0);
        const yard: number = acres.reduce((p, a) => a.t === '#' ? p + 1 : p, 0);

        console.log('->',m);
        console.log(wood, yard, wood * yard);
        console.log(wood - lastWood, yard - lastYard, (wood * yard) - (lastWood * lastYard));

        lastWood = wood;
        lastYard = yard;
        // render(map, acres);
    }

    const wood: number = acres.reduce((p, a) => a.t === '|' ? p + 1 : p, 0);
    const yard: number = acres.reduce((p, a) => a.t === '#' ? p + 1 : p, 0);

    return wood * yard;
}
