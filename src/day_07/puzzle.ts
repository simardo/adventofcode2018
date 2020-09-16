import { DAY_07_INPUT } from './input';

console.log('DAY 07');

type Step = {
    id: string,
    dependsOn: Step[],
    completed: boolean,
    duration: number,
    dueTime?: number
};

type Worker = {
    work: Step | undefined;
}

type StepsTree = { [key: string]: Step };

function buildStepsTree(input: string, baseDuration: number): StepsTree {
    const rx: RegExp = /\s(\w)\s.+\s(\w)\s/g;
    const tree: StepsTree = {};

    let match: RegExpMatchArray | null;
    while ((match = rx.exec(input)) !== null) {
        const from: string = match[1];
        const to: string = match[2];

        if (tree[from] === undefined) {
            tree[from] = { id: from, dependsOn: [], completed: false, duration: baseDuration + from.charCodeAt(0) - 64 };
        }

        if (tree[to] === undefined) {
            tree[to] = { id: to, dependsOn: [], completed: false, duration: baseDuration + to.charCodeAt(0) - 64 };
        }
        tree[to].dependsOn.push(tree[from]);
    }

    return tree;
}

function getEnabledSteps(tree: StepsTree, currentTime?: number): Step[] {
    return Object.values(tree).reduce((p, c) => {
        if (c.completed === false && c.dependsOn.every(d => d.completed && (d.dueTime === undefined || d.dueTime <= currentTime!))) {
            p.push(c);
        }
        return p;
    }, [] as Step[]).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).reverse();
}

// PART 1
console.log(doPart1(DAY_07_INPUT));

export function doPart1(input: string): string {
    const tree: StepsTree = buildStepsTree(input, 0);

    const seq: Step[] = [];

    let candidates: Step[];
    do {
        candidates = getEnabledSteps(tree);

        if (candidates.length > 0) {
            const toProcess: Step = candidates.pop()!;
            seq.push(toProcess);
            toProcess.completed = true;
        }
    } while (seq.length < Object.values(tree).length);

    return seq.map(s => s.id).join('');
}

// PART 2
console.log(doPart2(DAY_07_INPUT, 60, 5));

export function doPart2(input: string, baseDuration: number, numWorkers: number): number {
    const tree: StepsTree = buildStepsTree(input, baseDuration);
    const workers: Worker[] = [];

    for (let i = 1; i <= numWorkers; i++) {
        workers.push({ work: undefined });
    }

    const seq: Step[] = [];

    let t: number = -1;
    let maxDueTime: number = 0;

    let candidates: Step[];
    do {
        t++;
        candidates = getEnabledSteps(tree, t);

        const enabledWorkers: Worker[] = workers.reduce((p, c) => {
            if (c.work === undefined || c.work.dueTime! <= t) {
                p.push(c);
            }
            return p;
        }, [] as Worker[]);

        enabledWorkers.forEach(w => {
            if (candidates.length > 0) {
                const toProcess: Step = candidates.pop()!;
                seq.push(toProcess);
                toProcess.completed = true;
                toProcess.dueTime = t + toProcess.duration;
                maxDueTime = Math.max(maxDueTime, toProcess.dueTime);
                w.work = toProcess;
            }
        })
    } while (t < maxDueTime);

    return t;
}
