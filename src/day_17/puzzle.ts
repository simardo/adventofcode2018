import { DAY_17_INPUT } from './input';

console.log('DAY 17');

type Square = {
    isRow: boolean;
    index: number;
    from: number;
    to: number;
}

type Map = {
    squares: string[][];
    spring: number;
}

function buildMap(input: string): Map {
    const rx: RegExp = /(x|y)=(\d+),\s(x|y)=(\d+)..(\d+)/g;

    const map: string[][] = [];
    const squares: Square[] = [];

    let match: RegExpMatchArray | null;
    while ((match = rx.exec(input)) !== null) {
        squares.push({
            isRow: match[1] === 'y',
            index: Number.parseInt(match[2]),
            from: Number.parseInt(match[4]),
            to: Number.parseInt(match[5])
        });
    }

    const minX: number = squares.reduce((p, s) => s.isRow && s.from < p ? s.from : p, Number.MAX_VALUE) - 1;
    const maxX: number = squares.reduce((p, s) => s.isRow && s.to > p ? s.to : p, 0) + 5;
    const maxY: number = squares.reduce((p, s) => !s.isRow && s.to > p ? s.to : p, 0);

    console.log(minX, maxX, maxY);

    for (let y: number = 0; y <= maxY; y++) {
        map.push(new Array((maxX - minX)).fill('.'));
    }

    squares.forEach(s => {
        if (s.isRow) {
            for (let x: number = s.from; x <= s.to; x++) {
                map[s.index][x - minX] = '#';
            }
        } else {
            for (let y: number = s.from; y <= s.to; y++) {
                map[y][s.index - minX] = '#';
            }
        }
    });

    const spring: number = 500 - minX;
    map[0][spring] = '+';

    return {
        squares: map,
        spring: spring
    };
}

function render(map: Map): void {
    console.log(map.squares.map((l, i) => ('000' + i).slice(-4) + l.join('')).join('\n'));
}

function waterfall(map: Map, waterX: number, waterY: number, mark: string): void {
    let water: number = waterY;
    let bottom: boolean = false;
    let first: boolean = true;

    while (!bottom) {
        water++;
        map.squares[water][waterX] = first ? mark : '|';
        first = false;
        bottom = water + 1 === map.squares.length || map.squares[water + 1][waterX] === '#';
    }
    map.squares[water][waterX] = '|';

    let stop = water + 1 === map.squares.length;
    while (!stop) {
        let stopLS: boolean = false;
        let stopRS: boolean = false;
        let stopLW: boolean = false;
        let stopRW: boolean = false;

        let x: number = waterX;
        while (!(map.squares[water][x] === '#' || map.squares[water][x] === 'x' || map.squares[water + 1][x] === '.')) {
            map.squares[water][x] = '~';
            x--;
        }
        if (map.squares[water][x] === 'x') {
            if (x != waterX) {
                stopLS = true;
            } else if (map.squares[water][x - 1] === '.') {
                waterfall(map, x - 1, water - 1, 'x');
                stop = true;
            }
        } else if (map.squares[water][x] === '#') {
            stopLW = true;
        } else if (map.squares[water + 1][x] === '.') {
            const k: string = `${x},${water - 1}`;
            waterfall(map, x, water - 1, 'x');
            stop = true;
        }

        x = waterX;
        map.squares[water][x] = '|';
        while (!(map.squares[water][x] === '#' || map.squares[water][x] === 'y' || map.squares[water + 1][x] === '.')) {
            map.squares[water][x] = '~';
            x++;
        }
        if (map.squares[water][x] === 'y') {
            if (x != waterX) {
                stopRS = true;
            } else if (map.squares[water][x + 1] === '.') {
                waterfall(map, x + 1, water - 1, 'y');
                stop = true;
            }
        } else if (map.squares[water][x] === '#') {
            stopRW = true;
        } else if (map.squares[water + 1][x] === '.') {
            const k: string = `${x},${water - 1}`;
            waterfall(map, x, water - 1, 'y');
            stop = true;
        }

        stop = stop || (stopLS && stopRS) || (stopLW && stopRS) || (stopLS && stopRW);

        if (!stop) {
            water--;
        }
    }
}

// PART 1
doPart1(DAY_17_INPUT);

export function doPart1(input: string): void {
    const map: Map = buildMap(input);

    render(map);

    waterfall(map, map.spring, 0, '|');

    render(map);

    const r = map.squares.reduce((p, m) => p + m.reduce((pp, mm) => mm === '~' || mm === '|' || mm === 'x' || mm === 'y' ? pp + 1 : pp, 0), 0);
    console.log(r, r - 5);
}

// PART 2
doPart2(DAY_17_INPUT);

export function doPart2(input: string): void {
    const map: Map = buildMap(input);

    waterfall(map, map.spring, 0, '|');

    map.squares.forEach(l => {
        let index: number;
        while ((index = l.findIndex(s => s === '~')) != -1) {
            let min: number;
            let left: string;
            let max: number;
            let right: string;
            while (!(l[index] === '#' || l[index] === 'x')) {
                index--;
            }
            min = index + 1;
            left = l[index];

            index++;
            while (!(l[index] === '#' || l[index] === 'y')) {
                index++;
            }
            max = index - 1;
            right = l[index];

            if (left === 'x' || right === 'y') {
                for (let i : number = min; i <= max; i++) {
                    l[i] = '|';
                }
            }

            if (left === '#' && right === '#') {
                for (let i : number = min; i <= max; i++) {
                    l[i] = 'o';
                }
            }
        }
    });

    render(map);

    console.log(map.squares.reduce((p, m) => p + m.reduce((pp, mm) => mm === 'o' ? pp + 1 : pp, 0), 0));
}
