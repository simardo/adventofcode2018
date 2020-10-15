import { DAY_20_INPUT } from './input';

console.log('DAY 20');

type Room = {
    x: number;
    y: number;
    north: Room | undefined;
    east: Room | undefined;
    west: Room | undefined;
    south: Room | undefined;
};

type RoomMap = { [key: string]: Room };

function toString(room: Room): string {
    return `x:${room.x},y:${room.y}`;
}

function moveTo(from: Room, direction: string, rooms: RoomMap): Room {
    let toX: number;
    let toY: number;
    if (direction === 'N') {
        toX = from.x;
        toY = from.y - 1;
    } else if (direction === 'E') {
        toX = from.x + 1;
        toY = from.y;
    } else if (direction === 'S') {
        toX = from.x;
        toY = from.y + 1;
    } else /* W */ {
        toX = from.x - 1;
        toY = from.y;
    }

    let dest: Room = rooms[getKeyFromCoord(toX, toY)];
    if (dest === undefined) {
        dest = {
            x: toX,
            y: toY
        } as Room;
        rooms[getKey(dest)] = dest;
    }

    if (direction === 'N') {
        from.north = dest;
        dest.south = from;
    } else if (direction === 'E') {
        from.east = dest;
        dest.west = from;
    } else if (direction === 'S') {
        from.south = dest;
        dest.north = from;
    } else /* W */ {
        from.west = dest;
        dest.east = from;
    }

    return dest;
}

function getKeyFromCoord(x: number, y: number): string {
    return `x:${x},y:${y}`;
}

function getKey(r: Room): string {
    return getKeyFromCoord(r.x, r.y);
}

function* nextRoute(routes: string[]): Generator<string> {
    for (let i: number = 0; i < routes.length; i++) {
        yield routes[i];
    }
}

type DijScore = { [key: string]: DijNode }

type DijNode = {
    r: Room;
    parent?: DijNode;
    score: number;
    visited?: boolean;
    destination?: boolean;
}

function dijkstra(map: RoomMap, from: Room, to: Room): DijNode | undefined {
    const scoredNodes: DijScore = {};

    const key0: string = getKey(from);
    const node0: DijNode = { r: map[key0], score: 0 };
    scoredNodes[key0] = node0;

    let completed: boolean = false;
    while (!completed) {
        const node: DijNode = Object.values(scoredNodes).reduce((p, sn) => !sn.visited && (p === undefined || sn.score < p.score) ? sn : p, undefined!);

        const fn: (d: Room | undefined) => void = (d => {
            if (d !== undefined) {
                const k: string = getKey(d);
                let cn: DijNode | undefined = scoredNodes[k];
                if (cn === undefined) {
                    cn = { r: d, score: Number.MAX_VALUE, destination: to.x === d.x && to.y === d.y };
                    scoredNodes[k] = cn;
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
            fn(node.r.north);
            fn(node.r.west);
            fn(node.r.east);
            fn(node.r.south);

            node.visited = true;
            completed = node.visited === true && node.destination === true;
        } else {
            completed = true;
        }
    }

    let p: DijNode | undefined = Object.values(scoredNodes).find(f => f.destination);

    return p;
}
function doRoutes(from: Room, rooms: RoomMap, rGen: Generator<string>, iter: IteratorResult<string>): boolean {
    let result = false;
    let currentRoom: Room = from;
    let stop: boolean = false;
    while (!(iter.done || stop)) {
        if (iter.value === '(') {
            iter = rGen.next();
            if (doRoutes(currentRoom, rooms, rGen, iter)) {
                iter = rGen.next();
            } else {
                iter = rGen.next();
            }
        } else if (iter.value === ')') {
            stop = true;
        } else if (iter.value === '|') {
            currentRoom = from;
            iter = rGen.next();
            if (iter.value === ')') {
                stop = true;
                result = true;
            }
        } else {
            currentRoom = moveTo(currentRoom, iter.value, rooms);
            iter = rGen.next();
        }
    }

    return result;
}

type MapTuple = {
    rooms: RoomMap;
    origin: Room;
}

function buildMap(input: string): MapTuple {
    const routes: string[] = [...input];
    const rooms: RoomMap = {};

    const origin: Room = {
        x: 0,
        y: 0
    } as Room;

    rooms[getKey(origin)] = origin;

    let r: Generator<string> = nextRoute(routes);
    let i: IteratorResult<string> = r.next();

    doRoutes(origin, rooms, r, i);

    return { rooms: rooms, origin: origin };
}

// PART 1
// doPart1(DAY_20_INPUT);

export function doPart1(input: string): void {
    const mapTuple: MapTuple = buildMap(input);

    const visited: { [key: string]: boolean } = {};

    const doors: number = Object.values(mapTuple.rooms).reduce((p, r, i) => {
        if (r !== mapTuple.origin && visited[getKey(r)] === undefined) {
            const spr: DijNode | undefined = dijkstra(mapTuple.rooms, mapTuple.origin, r);
            if (spr) {
                visited[getKey(spr.r)] = true;
                let pr: DijNode | undefined = spr.parent;
                while (pr !== undefined) {
                    visited[getKey(pr.r)] = true;
                    pr = pr.parent;
                }
                if (spr.score > p) {
                    return spr.score;
                } else {
                    return p;
                }
            } else {
                return p;
            }
        } else {
            return p;
        }
    }, 0);

    console.log(doors);
}

// PART 2
// doPart2(DAY_20_INPUT, 1000);

export function doPart2(input: string, numDoors: number): void {
    const mapTuple: MapTuple = buildMap(input);

    console.log('dijkstra')

    const visited: { [key: string]: boolean } = {};

    const doors: number = Object.values(mapTuple.rooms).reverse().reduce((p, r, i) => {
        if (r !== mapTuple.origin && visited[getKey(r)] === undefined) {
            const spr: DijNode | undefined = dijkstra(mapTuple.rooms, mapTuple.origin, r);
            if (spr) {
                let count: number = 0;
                let countDoors: number = spr.score - numDoors;
                let pr: DijNode | undefined = spr;
                do  {
                    const k: string = getKey(pr.r);
                    if (countDoors >= 0 && visited[k] === undefined) {
                        countDoors--;
                        count++;
                    }
                    visited[k] = true;
                    pr = pr.parent;
                }
                while (pr !== undefined);
                return p + count;
            } else {
                return p;
            }
        } else {
            return p;
        }
    }, 0);

    console.log(doors);
}
