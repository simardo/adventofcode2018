import { DAY_06_INPUT } from './input';

type Coords = {
    id?: string,
    x: number,
    y: number
};

type Boundaries = {
    topLeft: Coords,
    bottomRight: Coords
};

type PointDistance = {
    id: string,
    dist: number
}

type Map = { [key: string]: PointDistance }

function getCoords(input: string): Coords[] {
    const rx: RegExp = /(\d+),\s(\d+)/g;
    const r: Coords[] = [];

    let match: RegExpMatchArray | null;

    let i: number = 97;
    while ((match = rx.exec(input)) !== null) {
        r.push({
            id: String.fromCharCode(i++),
            x: Number.parseInt(match[1]),
            y: Number.parseInt(match[2])
        });
    }

    return r;
}

function getBoundaries(coords: Coords[]): Boundaries {
    return coords.reduce((p, c) => {
        return {
            topLeft: { x: Math.min(c.x, p.topLeft.x), y: Math.min(c.y, p.topLeft.y) },
            bottomRight: { x: Math.max(c.x, p.bottomRight.x), y: Math.max(c.y, p.bottomRight.y) }
        }
    }, {
        topLeft: {
            x: Number.MAX_VALUE, y: Number.MAX_VALUE
        },
        bottomRight: {
            x: 0, y: 0
        },
    });
}

function computeGrid1(coords: Coords[], boundaries: Boundaries): Map {
    const map: Map = {};

    coords.forEach(c => {
        for (let x: number = boundaries.topLeft.x; x <= boundaries.bottomRight.x; x++) {
            for (let y: number = boundaries.topLeft.y; y <= boundaries.bottomRight.y; y++) {
                const dist: number = calcDistances(c, x, y);
                const key: string = `${x},${y}`;
                if (map[key] === undefined || dist < map[key].dist) {
                    map[key] = { id: c.id!, dist: dist };
                } else if (dist === map[key].dist) {
                    map[key] = { id: '.', dist: dist };
                }
            }
        }
    });

    return map;
}

function computeGrid2(coords: Coords[], boundaries: Boundaries): Map {
    const map: Map = {};

    coords.forEach(c => {
        for (let x: number = boundaries.topLeft.x; x <= boundaries.bottomRight.x; x++) {
            for (let y: number = boundaries.topLeft.y; y <= boundaries.bottomRight.y; y++) {
                const dist: number = calcDistances(c, x, y);
                const key: string = `${x},${y}`;
                if (map[key] === undefined) {
                    map[key] = { id: '', dist: dist };
                } else {
                    map[key] = { id: '', dist: dist + map[key].dist };
                }
            }
        }
    });

    return map;
}

function calcDistances(c: Coords, x: number, y: number): number {
    return Math.abs(x - c.x) + Math.abs(y - c.y);
}

// PART 1
// doPart1(DAY_06_INPUT);

export function doPart1(input: string): void {
    const coords: Coords[] = getCoords(input);
    const boundaries: Boundaries = getBoundaries(coords);

    const map: Map = computeGrid1(coords, boundaries);

    const exclusions: { [key: string]: boolean } = {};
    for (let x: number = boundaries.topLeft.x; x <= boundaries.bottomRight.x; x++) {
        exclusions[map[`${x},${boundaries.topLeft.y}`].id] = true;
        exclusions[map[`${x},${boundaries.bottomRight.y}`].id] = true;
    }

    for (let y: number = boundaries.topLeft.y; y <= boundaries.bottomRight.y; y++) {
        exclusions[map[`${boundaries.topLeft.x},${y}`].id] = true;
        exclusions[map[`${boundaries.bottomRight.x},${y}`].id] = true;
    }

    const areas: { [key: string]: number } = {};
    Object.values(map).forEach(m => {
        if (exclusions[m.id] === undefined) {
            if (areas[m.id] === undefined) {
                areas[m.id] = 1;
            } else {
                areas[m.id] = areas[m.id] + 1;
            }
        }
    });

    console.log(Object.values(areas).reduce((p, c) => Math.max(p, c), 0));
}

// PART 2
doPart2(DAY_06_INPUT, 10000);

export function doPart2(input: string, threshold: number): void {
    const coords: Coords[] = getCoords(input);
    const boundaries: Boundaries = getBoundaries(coords);

    const map: Map = computeGrid2(coords, boundaries);

    console.log(Object.values(map).reduce((p,c) => c.dist < threshold ? p + 1 : p, 0));
}
