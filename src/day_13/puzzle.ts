import fs from 'fs';

console.log('DAY 13');

type Coord = {
    x: number;
    y: number;
}

enum Direction {
    North,
    South,
    West,
    East
}

enum IntersectChoice {
    Left,
    Straight,
    Right
}

type Cart = {
    active: boolean;
    choice: IntersectChoice;
    pos: Coord;
    direction: Direction;
}

type Map = {
    map: string[][];
    carts: Cart[];
}

function buildMap(input: string): Map {
    const mapLines: string[] = input.replace(/\r/g, '').split('\n');
    const carts: Cart[] = [];

    // console.log(mapLines);

    const map: string[][] = [];
    mapLines.forEach((line, y) => {
        const lineV: string[] = [...line];
        lineV.forEach((l, x) => {
            const pos: Coord = { x: x, y: y };
            if (l === '^') {
                carts.push({ pos: pos, direction: Direction.North, choice: IntersectChoice.Left, active: true })
                lineV[x] = '|';
            } else if (l === '>') {
                carts.push({ pos: pos, direction: Direction.East, choice: IntersectChoice.Left, active: true })
                lineV[x] = '-';
            } else if (l === 'v') {
                carts.push({ pos: pos, direction: Direction.South, choice: IntersectChoice.Left, active: true })
                lineV[x] = '|';
            } else if (l === '<') {
                carts.push({ pos: pos, direction: Direction.West, choice: IntersectChoice.Left, active: true })
                lineV[x] = '-';
            }
        });

        // console.log(lineV);

        map.push(lineV);
    });

    return {
        map: map,
        carts: carts
    };
}

function moveCart(cart: Cart, map: string[][]): void {
    let nextPos: Coord;
    let next: string;

    if (cart.direction === Direction.North) {
        nextPos = { x: cart.pos.x, y: cart.pos.y - 1 };
        next = map[nextPos.y][nextPos.x];
        if (next === '/') {
            cart.direction = Direction.East;
        } else if (next === '\\') {
            cart.direction = Direction.West;
        } else if (next === '+') {
            if (cart.choice === IntersectChoice.Left) {
                cart.direction = Direction.West;
                cart.choice = IntersectChoice.Straight;
            } else if (cart.choice === IntersectChoice.Straight) {
                cart.choice = IntersectChoice.Right;
            } else if (cart.choice === IntersectChoice.Right) {
                cart.direction = Direction.East;
                cart.choice = IntersectChoice.Left;
            }
        }
    } else if (cart.direction === Direction.South) {
        nextPos = { x: cart.pos.x, y: cart.pos.y + 1 };
        next = map[nextPos.y][nextPos.x];
        if (next === '/') {
            cart.direction = Direction.West;
        } else if (next === '\\') {
            cart.direction = Direction.East;
        } else if (next === '+') {
            if (cart.choice === IntersectChoice.Left) {
                cart.direction = Direction.East;
                cart.choice = IntersectChoice.Straight;
            } else if (cart.choice === IntersectChoice.Straight) {
                cart.choice = IntersectChoice.Right;
            } else if (cart.choice === IntersectChoice.Right) {
                cart.direction = Direction.West;
                cart.choice = IntersectChoice.Left;
            }
        }
    } else if (cart.direction === Direction.West) {
        nextPos = { x: cart.pos.x - 1, y: cart.pos.y };
        next = map[nextPos.y][nextPos.x];
        if (next === '/') {
            cart.direction = Direction.South;
        } else if (next === '\\') {
            cart.direction = Direction.North;
        } else if (next === '+') {
            if (cart.choice === IntersectChoice.Left) {
                cart.direction = Direction.South;
                cart.choice = IntersectChoice.Straight;
            } else if (cart.choice === IntersectChoice.Straight) {
                cart.choice = IntersectChoice.Right;
            } else if (cart.choice === IntersectChoice.Right) {
                cart.direction = Direction.North;
                cart.choice = IntersectChoice.Left;
            }
        }
    } else if (cart.direction === Direction.East) {
        nextPos = { x: cart.pos.x + 1, y: cart.pos.y };
        next = map[nextPos.y][nextPos.x];
        if (next === '/') {
            cart.direction = Direction.North;
        } else if (next === '\\') {
            cart.direction = Direction.South;
        } else if (next === '+') {
            if (cart.choice === IntersectChoice.Left) {
                cart.direction = Direction.North;
                cart.choice = IntersectChoice.Straight;
            } else if (cart.choice === IntersectChoice.Straight) {
                cart.choice = IntersectChoice.Right;
            } else if (cart.choice === IntersectChoice.Right) {
                cart.direction = Direction.South;
                cart.choice = IntersectChoice.Left;
            }
        }
    }
    cart.pos = nextPos!;
}

function reOrderCarts(carts: Cart[]): Cart[] {
    return carts.sort((a,b) =>{
        if (a.pos.y < b.pos.y) {
            return -1;
        } else if (a.pos.y > b.pos.y) {
            return 1;
        } else if (a.pos.x < b.pos.x) {
            return -1;
        } else if (a.pos.x > b.pos.x) {
            return 1;
        } else {
            return 0;
        }
    });
}

// PART 1
console.log(doPart1(fs.readFileSync('./src/day_13/input.txt', 'utf8')));

export function doPart1(input: string): Coord {
    let result: Coord | undefined;

    const map: Map = buildMap(input);

    let collision = false;
    while (!collision) {
        map.carts.forEach(c => {
            moveCart(c, map.map);

            collision = collision || map.carts.some(cc => cc != c && cc.pos.x === c.pos.x && cc.pos.y === c.pos.y);
            if (collision && result === undefined) {
                result = c.pos;
            }
        });

        map.carts = reOrderCarts(map.carts);
    }

    return result!;
}

// PART 2
console.log(doPart2(fs.readFileSync('./src/day_13/input.txt', 'utf8')));

export function doPart2(input: string): Coord {
    let result: Coord | undefined;

    const map: Map = buildMap(input);

    let completed: boolean = false;
    while (!completed) {
        map.carts.forEach(c => {
            if (c.active) {
                moveCart(c, map.map);
            }

            map.carts.forEach(cc => {
                if (cc.active && cc != c && cc.pos.x === c.pos.x && cc.pos.y === c.pos.y) {
                    c.active = false;
                    cc.active = false;
                }
            });
        });

        map.carts = reOrderCarts(map.carts.filter(c => c.active));

        completed = map.carts.length === 1;
        if (completed) {
            result = map.carts[0].pos;
        }
    }

    return result!;
}
