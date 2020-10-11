import { DAY_19_INPUT } from './input';

console.log('DAY 19');

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

// PART 1
doPart1(DAY_19_INPUT, 4, [0, 0, 0, 0, 0, 0]);

// PART 2
doPart2(DAY_19_INPUT, 4, [1, 0, 0, 0, 0, 0]);

export function doPart1(input: string, ipb: number, reg: number[]): void {
    const instr: Opcode[] = input.split('\n').map(i => {
        const args: string[] = i.split(' ');
        return {
            code: args[0],
            a: Number.parseInt(args[1]),
            b: Number.parseInt(args[2]),
            o: Number.parseInt(args[3])
        } as Opcode;
    });

    let register: number[] = reg;
    let lastReg0: number = 0;
    let pointer: number = 0;
    while (pointer >= 0 && pointer < instr.length) {
        register[ipb] = pointer;

        register = exec(instr[pointer], register);

        lastReg0 = register[0];

        pointer = register[ipb];
        pointer++;
    }

    console.log(lastReg0);
}

export function doPart2(input: string, ipb: number, reg: number[]): void {
    const instr: Opcode[] = input.split('\n').map(i => {
        const args: string[] = i.split(' ');
        return {
            code: args[0],
            a: Number.parseInt(args[1]),
            b: Number.parseInt(args[2]),
            o: Number.parseInt(args[3])
        } as Opcode;
    });

    let register: number[] = reg;
    let lastReg0: number = 0;
    let pointer: number = 0;
    while (pointer >= 0 && pointer < instr.length) {
        register[ipb] = pointer;

        if (pointer === 3) {
            register[1] = 1;
            if (register[2] % register[5] === 0) {
                register[3] = register[2];
                register[4] = 6;
            } else {
                register[3] = register[2] + 1;
                register[4] = 11;
            }
        } else {
            register = exec(instr[pointer], register);
        }

        lastReg0 = register[0];

        pointer = register[ipb];
        pointer++;
    }

    console.log(lastReg0);
}
