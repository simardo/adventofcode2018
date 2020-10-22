import { DAY_25_INPUT } from './input';

console.log('DAY 25');

type Coord = {
    x: number;
    y: number;
    z: number;
    a: number;
    constellation: number | undefined;
}

function calcDistance(from: Coord, to: Coord): number {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + Math.abs(from.z - to.z) + Math.abs(from.a - to.a);
}

// PART 1
doPart1(DAY_25_INPUT);

export function doPart1(input: string): void {
    const coords: Coord[] = input.split('\n').map(l => {
        const c: string[] = l.split(',');
        return {
            x: Number.parseInt(c[0]),
            y: Number.parseInt(c[1]),
            z: Number.parseInt(c[2]),
            a: Number.parseInt(c[3]),
            constellation: undefined
        };
    });

    let nextConstellation: number = 1;

    for (let i: number = 0; i < coords.length; i++) {
        const c: Coord = coords[i];
        for (let j: number = i + 1; j < coords.length; j++) {
            const cc: Coord = coords[j];

            if (calcDistance(c, cc) <= 3) {
                if (c.constellation === undefined && cc.constellation === undefined) {
                    c.constellation = nextConstellation;
                    cc.constellation = nextConstellation;
                    nextConstellation++;
                } else if (cc.constellation === undefined) {
                    cc.constellation = c.constellation;
                } else if (c.constellation === undefined) {
                    c.constellation = cc.constellation;
                } else {
                    coords.filter(ccc => ccc.constellation === cc.constellation).forEach(m => m.constellation = c.constellation);
                }
            }
        }
        if (c.constellation === undefined) {
            c.constellation = nextConstellation;
            nextConstellation++;
        }
    }

    console.log(coords);

    const constellations: {[key: number]: any} = {};
    coords.forEach(c => constellations[c.constellation!] = true);

    console.log(Object.values(constellations).length);
}
