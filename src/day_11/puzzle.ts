console.log('DAY 10');

type Coord = {
    x: number;
    y: number;
    size?: number;
    power?: number;
}

type FuelGrid = { [key: string]: number };

function computeGrid(serial: number): FuelGrid {
    const fuel: FuelGrid = {};

    for (let x: number = 1; x <= 300; x++) {
        for (let y: number = 1; y <= 300; y++) {
            const power: number = computeCellPower(serial, x, y);
            fuel[`${x},${y}`] = power;
        }
    }

    return fuel;
}

export function computeCellPower(serial: number, x: number, y: number): number {
    const rackID: number = x + 10;
    let power: number = rackID * y;
    power += serial;
    power *= rackID;
    const hundreds: string[] = [...power.toString()].slice(-3);
    power = hundreds.length === 3 ? Number.parseInt(hundreds[0]) : 0;
    return power - 5;
}

function computeSquare(serial: number, size: number): Coord {
    let result: Coord = { x: 0, y: 0 };
    let maxPower: number = 0;

    const fuel: FuelGrid = computeGrid(serial);

    for (let x: number = 1; x <= 301 - size; x++) {
        for (let y: number = 1; y <= 301 - size; y++) {
            let power: number = 0;
            for (let xx: number = x; xx < x + size; xx++) {
                for (let yy: number = y; yy < y + size; yy++) {
                    power += fuel[`${xx},${yy}`];
                }
            }
            if (power > maxPower) {
                maxPower = power;
                result = { x: x, y: y, size: size, power: power };
            }
        }
    }

    return result;
}

// PART 1
console.log(doPart1(0));

export function doPart1(serial: number): Coord {
    return computeSquare(serial, 3);
}

// PART 2
console.log(doPart2(0));

export function doPart2(serial: number): Coord {
    let maxPower: number = 0;
    let result: Coord = {x:0,y:0};

    for (let size: number = 1; size <= 300; size++) {
        console.log(size);

        const coord: Coord = computeSquare(serial, size);
        if (coord.power! > maxPower) {
            maxPower = coord.power!;
            result = coord;
            console.log(size, coord);
        }
    }
    return result;
}
