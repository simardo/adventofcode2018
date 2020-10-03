import { DAY_15_INPUT } from './input';

console.log('DAY 15');

type Coord = {
    x: number;
    y: number;
}

type Unit = {
    t: MapNodeType;
    pos: Coord;
    hp: number;
}

type DijNode = {
    m: MapNode;
    parent?: DijNode;
    score: number;
    visited?: boolean;
    destination?: boolean;
}

enum MapNodeType {
    Free,
    Elf,
    Goblin,
    Wall
}

type MapNode = {
    c: Coord;
    t: MapNodeType;
}

function toString(node: DijNode): string {
    return `m:${`x:${node.m.c.x},y:${node.m.c.y}`} s:${node.score} v:${node.visited} d:${node.destination}`;
}

function buildMap(input: string): MapNode[][] {
    return input.split('\n').map((l, y) => [...l].map((ll, x) => {
        const coord: Coord = { x: x, y: y };
        let nodeType: MapNodeType;
        nodeType = ll === '.'
            ? MapNodeType.Free
            : ll === '#'
                ? MapNodeType.Wall
                : ll === 'E'
                    ? MapNodeType.Elf
                    : MapNodeType.Goblin;
        return { c: coord, t: nodeType };
    }));
}

function keyFrom(x: number, y: number): string {
    return `x:${x},y:${y}`;
}

function dijkstra(map: MapNode[][], from: Unit, to: Unit): DijNode | undefined {
    const scoredNodes: { [key: string]: DijNode } = {};

    const node0: DijNode = { m: map[from.pos.y][from.pos.x], score: 0 };
    scoredNodes[keyFrom(from.pos.x, from.pos.y)] = node0;

    let completed: boolean = false;
    while (!completed) {
        const node: DijNode = Object.values(scoredNodes).reduce((p, sn) => !sn.visited && (p === undefined || sn.score < p.score) ? sn : p, undefined!);

        const fn: (x: number, y: number) => void = ((x, y) => {
            if (map[y][x].t === MapNodeType.Free || (to.pos.x === x && to.pos.y === y)) {
                let cn: DijNode | undefined = scoredNodes[keyFrom(x, y)];
                if (cn === undefined) {
                    cn = { m: map[y][x], score: Number.MAX_VALUE, destination: to.pos.x === x && to.pos.y === y };
                    scoredNodes[keyFrom(x, y)] = cn;
                }
                if (!cn.visited) {
                    const newScore: number = node.score + 1;
                    if (newScore < cn.score) {
                        cn.score = newScore;
                        cn.parent = node;
                    }
                }
            }
        });

        if (node) {
            fn(node.m.c.x, node.m.c.y - 1);
            fn(node.m.c.x - 1, node.m.c.y);
            fn(node.m.c.x + 1, node.m.c.y);
            fn(node.m.c.x, node.m.c.y + 1);

            node.visited = true;
            completed = node.visited === true && node.destination === true;
        } else {
            completed = true;
        }
    }

    let p: DijNode | undefined = Object.values(scoredNodes).find(f => f.destination);
    let score: number = p !== undefined ? p.score : Number.MAX_VALUE;

    while (p && p.parent !== node0) {
        p = p.parent!;
    }
    if (p) {
        p.score = score;
    }

    return p;
}

function reachable(map: MapNode[][], unit: Unit): boolean {
    return map[unit.pos.y][unit.pos.x - 1].t === MapNodeType.Free
        || map[unit.pos.y - 1][unit.pos.x].t === MapNodeType.Free
        || map[unit.pos.y][unit.pos.x + 1].t === MapNodeType.Free
        || map[unit.pos.y + 1][unit.pos.x].t === MapNodeType.Free;
}

function attacks(map: MapNode[][], unit: Unit, targets: Unit[], elfAttack: number): boolean {
    const targetType: MapNodeType = unit.t === MapNodeType.Elf ? MapNodeType.Goblin : MapNodeType.Elf;

    let target: Unit | undefined = undefined;

    const fn: (x: number, y: number) => void = (x, y) => {
        const t: Unit | undefined = targets.find(tt => tt.t === targetType && tt.hp > 0 && tt.pos.x === x && tt.pos.y === y);
        if (t && (target === undefined || t.hp < target.hp)) {
            target = t;
        }
    };

    fn(unit.pos.x, unit.pos.y - 1);
    fn(unit.pos.x - 1, unit.pos.y);
    fn(unit.pos.x + 1, unit.pos.y);
    fn(unit.pos.x, unit.pos.y + 1);

    if (target !== undefined) {
        if (target!.t === MapNodeType.Elf) {
            target!.hp -= 3;
        } else {
            target!.hp -= elfAttack;
        }
        if (target!.hp <= 0) {
            map[target!.pos.y][target!.pos.x].t = MapNodeType.Free;
            console.log('killed', target, 'by', unit);
        }
    }

    return target !== undefined;
}

function doCombat(input: string, elfAttack: number, breakOnDeath: boolean): boolean {
    console.log('force', elfAttack);

    const map: MapNode[][] = buildMap(input);
    const units: Unit[] = [];

    for (let y: number = 0; y < map.length; y++) {
        for (let x: number = 0; x < map[y].length; x++) {
            if (map[y][x].t === MapNodeType.Elf || map[y][x].t === MapNodeType.Goblin) {
                units.push({
                    t: map[y][x].t,
                    pos: { x: x, y: y },
                    hp: 200
                });
            }
        }
    }

    let round: number = 0;
    let ok: boolean = true;
    while (ok && units.some(u => u.t === MapNodeType.Elf && u.hp > 0) && units.some(u => u.t === MapNodeType.Goblin && u.hp > 0)) {
        console.log('round', ++round);

        units.sort((a, b) => a.pos.y < b.pos.y ? -1 : a.pos.y > b.pos.y ? 1 : a.pos.x < b.pos.x ? -1 : a.pos.x > b.pos.x ? 1 : 0).filter(u => u.hp > 0).forEach(u => {
            if (u.hp > 0) {
                if (!attacks(map, u, units, elfAttack) && reachable(map, u)) {
                    const target: MapNodeType = u.t === MapNodeType.Elf ? MapNodeType.Goblin : MapNodeType.Elf;

                    const ranges: DijNode[] = [];
                    units.filter(uu => uu.hp > 0 && uu.t === target).forEach(t => {
                        if (reachable(map, t)) {
                            const shortest: DijNode | undefined = dijkstra(map, u, t);
                            if (shortest) {
                                ranges.push(shortest);
                            }
                        }
                    });

                    if (ranges.length > 0) {
                        const chosenOne: DijNode = ranges.reduce((p, c) => p === undefined || c.score < p.score ? c : p, undefined!);

                        map[u.pos.y][u.pos.x].t = MapNodeType.Free;

                        u.pos.x = chosenOne.m.c.x;
                        u.pos.y = chosenOne.m.c.y;
                        map[u.pos.y][u.pos.x].t = u.t;

                        attacks(map, u, units, elfAttack);
                    }
                }
            }
        });

        map.forEach(y => console.log(y.map(x => x.t === MapNodeType.Elf ? 'E' : x.t === MapNodeType.Goblin ? 'G' : x.t === MapNodeType.Free ? '.' : '#').join('')));

        ok = !(breakOnDeath && units.some(u => u.t === MapNodeType.Elf && u.hp <= 0));
    }

    console.log(units);
    const totalhp: number = units.reduce((p,u) => u.hp >= 0 ? p + u.hp : p, 0);
    console.log(totalhp * (round - 1));
    console.log(totalhp * round);

    return units.some(u => u.t === MapNodeType.Elf && u.hp <= 0);
}

// PART 1
doPart1(DAY_15_INPUT);

export function doPart1(input: string): void {
    doCombat(input, 3, false);
}

// PART 2
doPart2(DAY_15_INPUT);

export function doPart2(input: string): void {
    let force: number = 4;
    while (doCombat(input, force, true)) {
        force++;
    }
    console.log('final force', force);
}
