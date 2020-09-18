import { DAY_08_INPUT } from './input';

console.log('DAY 08');

type Node = {
    childCount: number;
    metaCount: number;
    meta?: number[];
    children: Node[];
}

function processNode(fileNode: number[]): Node[] {
    let remain: number[] = fileNode;
    const nodes: Node[] = [];
    const stack: Node[] = [];

    while (remain.length > 0) {
        let handleNode: boolean = true;

        let parent: Node | undefined = undefined;

        if (stack.length > 0) {
            parent = stack[stack.length - 1];
            if (parent.children.length === parent.childCount) {
                handleNode = false;
                parent = stack.pop();
            }
        }

        if (handleNode) {
            const node: Node = {
                childCount: remain[0],
                children: [],
                metaCount: remain[1]
            };
            nodes.push(node);

            if (parent !== undefined) {
                parent.children.push(node);
            }

            if (node.childCount === 0) {
                node.meta = remain.slice(2, 2 + node.metaCount);
                remain = remain.slice(2 + node.metaCount);
            } else {
                stack.push(node);
                remain = remain.slice(2);
            }
        } else if (parent !== undefined) {
            parent.meta = remain.slice(0, parent.metaCount);
            remain = remain.slice(parent.metaCount);
        }
    }

    return nodes;
}

function calcValue(node: Node, metaAcc: (value: number) => void): void {
    if (node.childCount === 0) {
        const meta: number = node.meta!.reduce((p, c) => p + c, 0);
        metaAcc(meta);
    } else {
        node.meta!.forEach(m => {
            const child: Node | undefined = node.children[m - 1];
            if (child !== undefined) {
                calcValue(child, metaAcc);
            }
        });
    }
}

// PART 1
console.log(doPart1(DAY_08_INPUT));

export function doPart1(input: string): number {
    const file: number[] = input.split(' ').map(s => Number.parseInt(s));

    const nodes: Node[] = processNode(file);
    return nodes.reduce((p, c) => p + c.meta!.reduce((pp, cc) => pp + cc, 0), 0);
}

// PART 2
console.log(doPart2(DAY_08_INPUT));

export function doPart2(input: string): number {
    const file: number[] = input.split(' ').map(s => Number.parseInt(s));

    const nodes: Node[] = processNode(file);
    const root: Node = nodes[0];

    let meta: number = 0;
    calcValue(root, m => meta += m);

    return meta;
}
