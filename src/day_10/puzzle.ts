import { DAY_10_INPUT } from './input';

console.log('DAY 10');

type Coord = {
    x: number;
    y: number;
}

type Light = {
    position: Coord,
    velovity: Coord
}

function getInitialState(input: string): Light[] {
    const rx: RegExp = /position=<\s*(-?\d+),\s*(-?\d+)>\svelocity=<\s*(-?\d+),\s*(-?\d+)>/g;

    const r: Light[] = [];

    let match: RegExpMatchArray | null;
    while ((match = rx.exec(input)) !== null) {
        const light: Light = {
            position: {
                x: Number.parseInt(match[1]),
                y: Number.parseInt(match[2])
            },
            velovity: {
                x: Number.parseInt(match[3]),
                y: Number.parseInt(match[4])
            }
        }
        r.push(light);
    }

    return r;
}

function render(lights: Light[]): void {
    let complete: boolean = false;
    let visible: boolean = false;
    let t: number = 0;
    while (!complete) {
        let minX: number = Number.MAX_VALUE;
        let minY: number = Number.MAX_VALUE;
        let maxX: number = 0;
        let maxY: number = 0;

        lights.forEach(l => {
            minX = Math.min(minX, l.position.x);
            minY = Math.min(minY, l.position.y);
            maxX = Math.max(maxX, l.position.x);
            maxY = Math.max(maxY, l.position.y);
        });
        if (maxX - minX <= 100 && maxY - minY <= 100) {
            console.log(t);

            visible = true;

            const lines: Array<string>[] = [];
            for (let y: number = minY; y <= maxY; y++) {
                lines.push(new Array(maxX - minX).fill('.'))
            }

            lights.forEach(l => {
                lines[l.position.y - minY][l.position.x - minX] = '#';
            });

            lines.forEach((l, i) => {
                console.log(l.join(''));
            });
        } else if (visible) {
            complete = true;
        }
        anime(lights);
        t++;
    };
}

function anime(lights: Light[]): void {
    lights.forEach(l => {
        l.position.x += l.velovity.x;
        l.position.y += l.velovity.y;
    })
}

// PART 1
doPart1(DAY_10_INPUT);

export function doPart1(input: string): void {
    const lights: Light[] = getInitialState(input);

    render(lights);
}
