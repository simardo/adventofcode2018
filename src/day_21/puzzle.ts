import { DAY_21_INPUT } from './input';

console.log('DAY 21');

type Opcode = {
    code: string;
    a: number;
    b: number;
    o: number;
}

function addr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('addr');
    const r: number[] = [...register];
    r[o] = register[a] + register[b];
    return r;
}

function addi(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('addi');
    const r: number[] = [...register];
    r[o] = register[a] + b;
    return r;
}

function mulr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('mulr');
    const r: number[] = [...register];
    r[o] = register[a] * register[b];
    return r;
}

function muli(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('muli');
    const r: number[] = [...register];
    r[o] = register[a] * b;
    return r;
}

function banr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('banr');
    const r: number[] = [...register];
    r[o] = register[a] & register[b];
    return r;
}

function bani(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('bani');
    const r: number[] = [...register];
    r[o] = register[a] & b;
    return r;
}

function borr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('borr');
    const r: number[] = [...register];
    r[o] = register[a] | register[b];
    return r;
}

function bori(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('bori');
    const r: number[] = [...register];
    r[o] = register[a] | b;
    return r;
}

function setr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('setr');
    const r: number[] = [...register];
    r[o] = register[a];
    return r;
}

function seti(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('seti');
    const r: number[] = [...register];
    r[o] = a;
    return r;
}

function gtir(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('gtir');
    const r: number[] = [...register];
    r[o] = a > register[b] ? 1 : 0;
    return r;
}

function gtri(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('gtri');
    const r: number[] = [...register];
    r[o] = register[a] > b ? 1 : 0;
    return r;
}

function gtrr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('gtrr');
    const r: number[] = [...register];
    r[o] = register[a] > register[b] ? 1 : 0;
    return r;
}

function eqir(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('eqir');
    const r: number[] = [...register];
    r[o] = a === register[b] ? 1 : 0;
    return r;
}

function eqri(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('eqri');
    const r: number[] = [...register];
    r[o] = register[a] === b ? 1 : 0;
    return r;
}

function eqrr(a: number, b: number, o: number, register: number[]): number[] {
    // console.log('eqrr');
    const r: number[] = [...register];
    r[o] = register[a] === register[b] ? 1 : 0;
    return r;
}

function exec(o: Opcode, register: number[]): number[] {
    let fn: (inputA: number, inputB: number, output: number, register: number[]) => number[];

    if (o.code === 'gtri') {
        fn = gtri;
    } else if (o.code === 'bani') {
        fn = bani;
    } else if (o.code === 'eqrr') {
        fn = eqrr;
    } else if (o.code === 'gtir') {
        fn = gtir;
    } else if (o.code === 'eqir') {
        fn = eqir;
    } else if (o.code === 'bori') {
        fn = bori;
    } else if (o.code === 'seti') {
        fn = seti;
    } else if (o.code === 'setr') {
        fn = setr;
    } else if (o.code === 'addr') {
        fn = addr;
    } else if (o.code === 'borr') {
        fn = borr;
    } else if (o.code === 'muli') {
        fn = muli;
    } else if (o.code === 'banr') {
        fn = banr;
    } else if (o.code === 'addi') {
        fn = addi;
    } else if (o.code === 'eqri') {
        fn = eqri;
    } else if (o.code === 'mulr') {
        fn = mulr;
    } else if (o.code === 'gtrr') {
        fn = gtrr;
    }

    return fn!(o.a, o.b, o.o, register);
}

function createProgram(input: string): Opcode[] {
    return input.split('\n').map(i => {
        const args: string[] = i.split(' ');
        return {
            code: args[0],
            a: Number.parseInt(args[1]),
            b: Number.parseInt(args[2]),
            o: Number.parseInt(args[3])
        } as Opcode;
    });
}

doPuzzle(DAY_21_INPUT, 5); // #ip 5

export function doPuzzle(input: string, ipb: number): void {
    const program: Opcode[] = createProgram(input);

    const dict: {[key: number]: boolean} = {};

    let register: number[] = [0, 0, 0, 0, 0, 0];
    let last4: number = 0;
    let pointer: number = 0;
    while (pointer >= 0 && pointer < program.length) {
        register[ipb] = pointer;

        register = exec(program[pointer], register);
        if (pointer === 28) {
            // part 1
            // console.log(register[4]);
            // throw 'part1';

            // part 2
            // if (dict[register[4]] !== undefined) {
            //     console.log(last4);
            //     throw 'part2';
            // } else {
            //     dict[register[4]] = true;
            //     last4 = register[4];
            // }
        }

        pointer = register[ipb];
        pointer++;
    }
}
