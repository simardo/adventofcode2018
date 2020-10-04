import { DAY_16_INPUT } from './input';
import { DAY_16_TEST_PROGRAM } from './testprogram';

console.log('DAY 16');

type Problem = {
    before: number[];
    opcode: Opcode;
    after: number[];
}

type Opcode = {
    code: number;
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

function exec(o: Opcode, registerIn: number[], registerOut: number[]): number {
    let r: number = 0;

    let i: number = 0;
    const matches: string[] = [];
    const validateFn: (r1: number[], r2: number[], z) => void = (r1, r2, z) => {
        if (r1.every((v, i) => v === r2[i])) {
            matches.push(`${o.code} => ${z}`);
            r++;
        }
    }

    validateFn(addr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(addi(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(mulr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(muli(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(banr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(bani(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(borr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(bori(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(setr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(seti(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(gtir(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(gtri(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(gtrr(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(eqir(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(eqri(o.a, o.b, o.o, registerIn), registerOut, i++);
    validateFn(eqrr(o.a, o.b, o.o, registerIn), registerOut, i++);

    if (r === 1) {
        console.log(matches);
    }

    return r;
}

function exec2(o: Opcode, register: number[]): number[] {
    let fn: (inputA: number, inputB: number, output: number, register: number[]) => number[];

    if (o.code === 0) {
        fn = gtri;
    } else if (o.code === 1) {
        fn = bani;
    } else if (o.code === 2) {
        fn = eqrr;
    } else if (o.code === 3) {
        fn = gtir;
    } else if (o.code === 4) {
        fn = eqir;
    } else if (o.code === 5) {
        fn = bori;
    } else if (o.code === 6) {
        fn = seti;
    } else if (o.code === 7) {
        fn = setr;
    } else if (o.code === 8) {
        fn = addr;
    } else if (o.code === 9) {
        fn = borr;
    } else if (o.code === 10) {
        fn = muli;
    } else if (o.code === 11) {
        fn = banr;
    } else if (o.code === 12) {
        fn = addi;
    } else if (o.code === 13) {
        fn = eqri;
    } else if (o.code === 14) {
        fn = mulr;
    } else if (o.code === 15) {
        fn = gtrr;
    }

    return fn!(o.a, o.b, o.o, register);
}

function* iter(input: string): Generator<Problem> {
    let step: number = 0;
    let before: number[] | undefined;
    let after: number[] | undefined;
    let opcodeV: number[] | undefined;

    const lines: string[] = input.split('\n');
    for (let i: number = 0; i < lines.length; i++) {
        const l: string = lines[i];
        step++;
        if (step === 1) {
            before = l.substring(l.indexOf('[') + 1, l.length - 1).split(',').map(s => Number.parseInt(s.trim()));
        } else if (step === 2) {
            opcodeV = l.split(' ').map(s => Number.parseInt(s.trim()));
        } else if (step === 3) {
            after = l.substring(l.indexOf('[') + 1, l.length - 1).split(',').map(s => Number.parseInt(s.trim()));
        } else if (step === 4) {
            step = 0;

            yield {
                before: before!,
                opcode: {
                    code: opcodeV![0],
                    a: opcodeV![1],
                    b: opcodeV![2],
                    o: opcodeV![3]
                },
                after: after!
            };
        }
    }
}

function* iter2(input: string): Generator<Opcode> {
    const lines: string[] = input.split('\n');
    for (let i: number = 0; i < lines.length; i++) {
        const l: string = lines[i];
        const opcodeV: number[] = l.split(' ').map(s => Number.parseInt(s.trim()));
        yield {
            code: opcodeV![0],
            a: opcodeV![1],
            b: opcodeV![2],
            o: opcodeV![3]
        };
    }
}

// PART 1
doPart1(DAY_16_INPUT);

export function doPart1(input: string): void {
    let m: Generator<Problem> = iter(input);
    let i: IteratorResult<Problem> | undefined = m.next();

    let r: number = 0;
    while (!i.done) {
        if (exec(i.value.opcode, i.value.before, i.value.after) >= 3) {
            r++
        }

        i = m.next();
    }

    console.log(r);
}

// PART 2
doPart2(DAY_16_TEST_PROGRAM);

export function doPart2(input: string): void {
    let m: Generator<Opcode> = iter2(input);
    let i: IteratorResult<Opcode> | undefined = m.next();

    let register: number[] = [0, 0, 0, 0];
    while (!i.done) {
        register = exec2(i.value, register);

        i = m.next();
    }

    console.log(register);
}
