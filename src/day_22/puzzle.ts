console.log('DAY 22');

// depth: 510
// target: 10, 10

// depth: 3879
// target: 8,713

type Coord = {
    x: number;
    y: number;
}

type RegionType = '.' | '=' | '|';

type Region = {
    c: Coord;
    gi: number;
    el: number;
    elm: number;
    t: RegionType;
}

type Equipment = 'C' | 'T' | 'N';

type EquipedRegion = {
    r: Region;
    e: Equipment;
}

function render(map: Region[][]): void {
    console.log(map.map(l => l.map(c => c.t).join('')).join('\n'));
}

function buildMap(depth: number, target: Coord): Region[][] {
    const map: Region[][] = [];

    const giFn: (x: number, y: number) => number = (x, y) => {
        let result: number;
        if ((x === 0 && y === 0) || (x === target.x && y === target.y)) {
            result = 0;
        } else if (y === 0) {
            result = x * 16807;
        } else if (x === 0) {
            result = y * 48271;
        } else {
            result = map[y][x - 1].el * map[y - 1][x].el;
        }
        return result;
    };

    const elFn: (gi: number) => number = g => (g + depth) % 20183;

    for (let y: number = 0; y <= target.y; y++) {
        map.push([]);
        for (let x: number = 0; x <= target.x; x++) {
            const gi: number = giFn(x, y);
            const el: number = elFn(gi);
            const elm: number = el % 3;
            map[y].push({
                c: { x: x, y: y },
                el: el,
                elm: elm,
                gi: gi,
                t: elm === 0 ? '.' : elm === 1 ? '=' : '|'
            });
        }
    }

    return map;
}

type DijScore = { [key: string]: DijNode }

type DijNode = {
    er: EquipedRegion;
    parent?: DijNode;
    score: number;
    visited?: boolean;
    destination?: boolean;
}

function getKey(e: EquipedRegion): string {
    return (`x:${e.r.c.x},y:${e.r.c.y},e:${e.e}`);
}

function dijkstra(map: Region[][], from: EquipedRegion, to: EquipedRegion): DijNode | undefined {
    const scoredNodes: DijScore = {};
    const visitedNodes: DijScore = {};

    const er0: EquipedRegion = { e: 'T', r: map[from.r.c.y][from.r.c.x] };
    const node0: DijNode = { er: er0, score: 0 };
    scoredNodes[getKey(er0)] = node0;

    let completed: boolean = false;
    while (!completed) {
        const node: DijNode = Object.values(scoredNodes).reduce((p, sn) => (p === undefined || sn.score < p.score) ? sn : p, undefined!);

        const fn2: (inType: RegionType, outType: RegionType, dest: boolean) => Equipment[] = (i, o, d) => {
            if (d) {
                return ['T'];
            } else if (i === '.' && o === '.') {
                return ['C', 'T'];
            } else if (i === '.' && o === '=') {
                return ['C'];
            } else if (i === '.' && o === '|') {
                return ['T'];
            } else if (i === '=' && o === '.') {
                return ['C'];
            } else if (i === '=' && o === '=') {
                return ['C', 'N'];
            } else if (i === '=' && o === '|') {
                return ['N'];
            } else if (i === '|' && o === '.') {
                return ['T'];
            } else if (i === '|' && o === '=') {
                return ['N'];
            } else /*if (i === '|' && o === '|') */ {
                return ['T', 'N'];
            }
        };

        const fn: (x: number, y: number, type: RegionType, equip: Equipment) => void = ((x, y, t, e) => {
            if (x >= 0 && y >= 0 && map[y][x] !== undefined) {
                const next: Region = map[y][x];
                const isDest: boolean = to.r.c.x === x && to.r.c.y === y;
                fn2(t, next.t, isDest).forEach(ee => {
                    const ern: EquipedRegion = { e: ee, r: next }
                    const k: string = getKey(ern);
                    let cn: DijNode | undefined = scoredNodes[k];
                    let cnv: DijNode | undefined = visitedNodes[k];

                    if (cn === undefined && cnv === undefined) {
                        cn = { er: ern, score: Number.MAX_VALUE, destination: isDest };
                        scoredNodes[k] = cn;
                    }
                    if (cn) {
                        const newScore: number = node.score + (ee === e ? 1 : 8);
                        if (newScore < cn.score) {
                            cn.score = newScore;
                            cn.parent = node;
                        }
                    }
                });
            }
        });

        if (node) {
            fn(node.er.r.c.x, node.er.r.c.y - 1, node.er.r.t, node.er.e);
            fn(node.er.r.c.x - 1, node.er.r.c.y, node.er.r.t, node.er.e);
            fn(node.er.r.c.x + 1, node.er.r.c.y, node.er.r.t, node.er.e);
            fn(node.er.r.c.x, node.er.r.c.y + 1, node.er.r.t, node.er.e);

            node.visited = true;
            const k: string = getKey(node.er);
            delete scoredNodes[k];
            visitedNodes[k] = node;

            completed = node.visited === true && node.destination === true;
        } else {
            completed = true;
        }
    }

    let p: DijNode | undefined = Object.values(visitedNodes).find(f => f.destination);

    return p;
}

// PART 1
doPart1();
function doPart1(): void {
    const map: Region[][] = buildMap(510, { x: 10, y: 10 });
    // const map: Region[][] = buildMap(3879, { x: 8, y: 713 });

    console.log(map.reduce((p, l) => p + l.reduce((pp, c) => pp + c.elm, 0), 0));
}

doPart2();
function doPart2(): void {
    // const map: Region[][] = buildMap(510, { x: 20, y: 20 });
    const map: Region[][] = buildMap(3879, { x: 100, y: 1000 });

    // const sp: DijNode | undefined = dijkstra(map, { e: 'T', r: map[0][0] }, { e: 'T', r: map[10][10] });
    const sp: DijNode | undefined = dijkstra(map, { e: 'T', r: map[0][0] }, { e: 'T', r: map[713][8] });

    console.log(sp!.score);
}
