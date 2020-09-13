import { DAY_04_INPUT } from './input';

enum Action {
    BeginsShift,
    FallsAsleep,
    WakesUp
};

type Schedule = {
    date: Date;
    action: Action;
    id?: number;
};

type Minutes = { [key: number]: number };

type SleepSchedule = { [key: number]: Minutes };

export function doSchedule(input: string): SleepSchedule {
    const log: Schedule[] = sortInput(input);
    const ss: SleepSchedule = {};

    let id: number = -1;
    let b: number = -1;

    log.forEach(l => {
        if (l.action === Action.BeginsShift) {
            id = l.id!;
            b = -1;
            if (ss[id] === undefined) {
                ss[id] = {};
            }
        } else if (l.action === Action.FallsAsleep) {
            b = l.date.getMinutes();
        } else if (l.action === Action.WakesUp) {
            for (let bb: number = b; bb < l.date.getMinutes(); bb++) {
                if (ss[id][bb] === undefined) {
                    ss[id][bb] = 1;
                } else {
                    ss[id][bb] = ss[id][bb] + 1;
                }
            }
        }
    });

    return ss;
}

function sortInput(input: string): Schedule[] {
    const r: Schedule[] = [];

    let m: Generator<RegExpMatchArray> = iterMatch(input);
    let i: IteratorResult<RegExpMatchArray> | undefined = m.next();

    const rx: RegExp = /(\d+)/g;

    while (!i.done) {
        let a: Action;
        let id: number | undefined = undefined;

        if (i.value[6] === 'falls asleep') {
            a = Action.FallsAsleep;
        } else if (i.value[6] === 'wakes up') {
            a = Action.WakesUp;;
        } else {
            a = Action.BeginsShift;
            id = Number.parseInt(i.value[6].match(rx)![0]);
        }
        const s: Schedule = {
            date: new Date(Number.parseInt(i.value[1]) + 400, Number.parseInt(i.value[2]) - 1, Number.parseInt(i.value[3]), Number.parseInt(i.value[4]), Number.parseInt(i.value[5])),
            action: a,
            id: id
        };

        r.push(s);

        i = m.next();
    }

    return r.sort((a, b) => a.date < b.date ? -1 : a > b ? 1 : 0);
}

function* iterMatch(s: string): Generator<RegExpMatchArray> {
    const rx: RegExp = /\[(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})\]\s(.+)/g;

    let match: RegExpMatchArray | null;

    while ((match = rx.exec(s)) !== null) {
        yield match;
    }
}

const sched: SleepSchedule = doSchedule(DAY_04_INPUT);

// PART 1
console.log(doPart1(sched));

export function doPart1(sched: SleepSchedule): number {
    let max: number = 0;
    let r: number = -1;

    Object.keys(sched).forEach(k => {
        const m: Minutes = sched[k];
        const tot: number = Object.values(m).reduce((p, c) => p + c, 0);
        if (tot > max) {
            max = tot;
            r = Number.parseInt(k);
        }
    });

    let max2: number = -1;
    let r2: number = -1;

    Object.keys(sched[r]).forEach(k => {
        if (sched[r][k] > max2) {
            max2 = sched[r][k];
            r2 = Number.parseInt(k);
        }
    });

    return r2 * r;
}

// PART 2
console.log(doPart2(sched));

export function doPart2(sched: SleepSchedule): number {
    let max: number = 0;
    let rm: number = -1;
    let ri: number = -1;

    Object.keys(sched).forEach(k => {
        Object.keys(sched[k]).forEach(m => {
            if (sched[k][m] > max) {
                max = sched[k][m];
                rm = Number.parseInt(m);
                ri = Number.parseInt(k);
            }
        });
    });

    return rm * ri;
}
